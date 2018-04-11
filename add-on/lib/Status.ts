interface IStatusSaveData {
  breakTimeLength: number;
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

  protected _running = false;
  get running () {
    return this._running;
  }

  protected _startedBreakingAt = 0;
  get startedBreakingAt () {
    return this._startedBreakingAt;
  }

  protected _breakTimeLength = 30000;  // 30 sec
  /**
   * How long you can take a break time.
   * (milliseconds)
   */
  get breakTimeLength () {
    return this._breakTimeLength;
  }

  public get breaking () {
    return this._startedBreakingAt !== 0;
  }

  private get saveData (): IStatusSaveData {
    return {
      breakTimeLength: this._breakTimeLength,
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
    this._breakTimeLength = values.breakTimeLength;
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

  public async reset () {
    // stop timer, which is not stored in storage
    this.stopBreaking();

    const defaultData = this.convertStorageObjectToStatusSaveData(null);
    await browser.storage.local.set(defaultData as any);
  }

  protected onStorageChanged (changes: browser.storage.ChangeDict, areaName: string) {
    if (changes.breakTimeLength) {
      this._breakTimeLength = changes.breakTimeLength.newValue;
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
      if (typeof obj.running !== "boolean") {
        throw new TypeError();
      }
      if (typeof obj.startedBreakingAt !== "number") {
        throw new TypeError();
      }

      return {
        breakTimeLength: obj.breakTimeLength,
        running: obj.running,
        startedBreakingAt: obj.startedBreakingAt,
      };
    }

    // default values
    return {
      breakTimeLength: 30000,
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
  }
}
