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
  protected _running = false;
  get running () {
    return this._running;
  }

  protected _startedBreakingAt = 0;
  get startedBreakingAt () {
    return this._startedBreakingAt;
  }

  public get breaking () {
    return this._startedBreakingAt !== 0;
  }

  private get saveData () {
    return {
      running: this._running,
      startedBreakingAt: this._startedBreakingAt,
    };
  }

  private onChangeCallbacks: Array<(data: any) => void> = [];

  /**
   * In milliseconds.
   */
  get breakingTime () {
    return this.breaking ? Date.now() - this._startedBreakingAt : -1;
  }

  /**
   * @see #save
   */
  protected get saveDataValues () {
    return {
      running: this._running,
      startedBreakingAt: this._startedBreakingAt,
    };
  }

  public async init () {
    browser.storage.onChanged.addListener((changes, areaName) => {
      this._running = changes.running.newValue;
      this._startedBreakingAt = changes.startedBreakingAt.newValue;
      this.runOnChangeCallbacks(changes, areaName);
    });

    const values =  await browser.storage.local.get();
    this._running = values.running as boolean;
    this._startedBreakingAt = values.startedBreakingAt as number;

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
    this.save();
  }

  /**
   * Have a break.
   */
  public startBraking () {
    this._startedBreakingAt = Date.now();
    this.save();
  }

  /**
   * End the break.
   */
  public stopBraking () {
    this._startedBreakingAt = 0;
    this.save();
  }

  public onChange (callback: (data: any) => void) {
    this.onChangeCallbacks.push(callback);
  }

  private runOnChangeCallbacks (changes: any, areaName: string) {
    this.onChangeCallbacks.forEach((fn) => fn(changes));
  }

  /**
   * Save current style.
   * It would emit something.
   */
  private async save () {
    await browser.storage.local.set(this.saveData);
  }
}
