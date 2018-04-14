// TODO split status and settings

interface IStatusSaveData {
  breakTimeLength: number;
  matches: string[];
  running: boolean;
  startedBreakingAt: number;
  version?: string;
}

/**
 * @example
 * const status = new Status();
 * await status.init();
 * status.onChange((data: any) => {
 *   console.log("Changed!", data.running, data.breakingTime);
 * });
 *
 * @example
 * status.start();
 * console.log(status.running); // => true
 * status.stop();
 * console.log(status.running); // => false
 */
class Status {
  protected tmStopBreaking = 0;
  protected originalValues: IStatusSaveData | null = null;

  protected _modified = false;
  /**
   * If some values are changed from the beginning.
   */
  get modified () {
    return this._modified;
  }

  protected _running = false;
  get running () {
    return this._running;
  }

  protected _matches: string[] = [];

  protected _startedBreakingAt = 0;
  get startedBreakingAt () {
    return this._startedBreakingAt;
  }

  protected _breakTimeLength = 60000;  // 1 min
  /**
   * How long you can take a break time.
   * (milliseconds)
   */
  get breakTimeLength () {
    return this._breakTimeLength;
  }

  public get matchesText () {
    return this._matches.join("\n");
  }

  public get breaking () {
    return this._startedBreakingAt !== 0;
  }

  private get saveData (): IStatusSaveData {
    return {
      breakTimeLength: this._breakTimeLength,
      matches: this._matches,
      running: this._running,
      startedBreakingAt: this._startedBreakingAt,
      version: "v1.1.0",
    };
  }

  private onChangeCallbacks: Array<(data: any) => void> = [];

  /**
   * (milliseconds)
   */
  public get remainingBreakTime () {
    if (this.breaking) {
      const elapsed = Date.now() - this._startedBreakingAt;
      return this._breakTimeLength - elapsed;
    } else {
      return 0;
    }
  }

  public async init () {
    browser.storage.onChanged.addListener((changes, areaName) => {
      this.onStorageChanged(changes, areaName);
    });

    const values =  await this.readStorage();
    this.originalValues = Object.freeze(values);
    this._breakTimeLength = values.breakTimeLength;
    this._matches = values.matches;
    this._running = values.running;
    this._startedBreakingAt = values.startedBreakingAt;

    return values;
  }

  /**
   * Start running and leave from SNS.
   */
  public start () {
    this._running = true;
    this.save();
  }

  /**
   * Stop running and get ready to enjoy SNS.
   */
  public stop () {
    this._running = false;
    this._startedBreakingAt = 0;
    this.save();
  }

  /**
   * Have a break.
   */
  public startBreaking () {
    this._startedBreakingAt = Date.now();
    this.save();

    const interval = this.breakTimeLength;
    this.tmStopBreaking = setTimeout(() => {
      this.stopBreaking();
    }, interval);
  }

  /**
   * End the break.
   */
  public stopBreaking () {
    this._startedBreakingAt = 0;
    this.save();

    clearTimeout(this.tmStopBreaking);
  }

  public onChange (callback: (data: any) => void) {
    this.onChangeCallbacks.push(callback);
  }

  /**
   * @param length (milliseconds)
   */
  public setBreakTimeLength (length: number) {
    if (length < 0) {
      throw new RangeError();
    }

    this._breakTimeLength = length;
    this.save();
  }

  public setMatches (matches: string[]) {
    this._matches = matches;
    this.save();
  }

  public async reset () {
    // stop timer, which is not stored in storage
    this.stopBreaking();

    const defaultData = this.convertStorageObjectToStatusSaveData(null);
    await browser.storage.local.set(defaultData as any);
  }

  public async revert () {
    // TODO revert only settings
    if (!this.originalValues) {
      throw new Error("Values are not ready.");
    }
    await browser.storage.local.set(this.originalValues as any);
    this._modified = false;
  }

  public isTargetURL (target: string) {
    const url = new URL(target);
    return this._matches.some((match) => this.isMatchedUrl(url, match));
  }

  protected onStorageChanged (changes: browser.storage.ChangeDict, areaName: string) {
    if (changes.breakTimeLength) {
      this._breakTimeLength = changes.breakTimeLength.newValue;
    }
    if (changes.matches) {
      this._matches = changes.matches.newValue;
    }
    if (changes.running) {
      this._running = changes.running.newValue;
    }
    if (changes.startedBreakingAt) {
      this._startedBreakingAt = changes.startedBreakingAt.newValue;
    }
    this.runOnChangeCallbacks(changes, areaName);
  }

  protected runOnChangeCallbacks (changes: any, areaName: string) {
    this.onChangeCallbacks.forEach((fn) => fn(changes));
  }

  /**
   * @returns Promise<IStatusSaveData>
   */
  protected async readStorage (): Promise<IStatusSaveData> {
    const keys = [
      "breakTimeLength",
      "matches",
      "running",
      "startedBreakingAt",
      "version",
    ];

    const result = await browser.storage.local.get(keys);
    return this.convertStorageObjectToStatusSaveData(result);
  }

  protected convertStorageObjectToStatusSaveData
    (obj: browser.storage.StorageObject | null): IStatusSaveData {

    if (!obj || !obj.version) {
      // return at the end
    } else if (obj.version === "v1.1.0") {
      if (typeof obj.breakTimeLength !== "number") {
        throw new TypeError();
      }
      if (!(obj.matches instanceof Array) || obj.matches.some((v) => typeof v !== "string")) {
        throw new TypeError();
      }
      if (typeof obj.running !== "boolean") {
        throw new TypeError();
      }
      if (typeof obj.startedBreakingAt !== "number") {
        throw new TypeError();
      }

      return {
        breakTimeLength: obj.breakTimeLength,
        matches: obj.matches as string[],
        running: obj.running,
        startedBreakingAt: obj.startedBreakingAt,
      };
    }

    // default values
    // TODO extract these default values
    return {
      breakTimeLength: 60000,
      matches: [
        "twitter.com",
        "facebook.com",
      ],
      running: false,
      startedBreakingAt: 0,
    };
  }

  /**
   * Save current style.
   * It would emit something.
   */
  protected async save () {
    await browser.storage.local.set(this.saveData as { [name: string]: any });
    this._modified = true;
  }

  /**
   * @param target The given URL.
   * @param match e.g. `"twitter.com"`
   */
  protected isMatchedUrl (target: URL, match: string) {
    const index = target.hostname.lastIndexOf(match);
    const expected = target.hostname.length - match.length;

    const found = index >= 0;
    const atEnd = index === expected;
    const followingLetter = target.hostname.charAt(expected - 1);
    const followingSomething = Boolean(followingLetter) && followingLetter !== ".";

    return found && atEnd && !followingSomething;
  }
}
