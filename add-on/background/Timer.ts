class Timer {
  public startedAt = 0;
  public tmInterval = 0;

  get running () {
    return !!this.startedAt;
  }

  /**
   * - not running: `""`
   * - running but not breaking: `"🛇"`
   * - running and breaking: remaining time in sec ceiled
   * - after finishing break: `"🛇"`
   */
  public get badgeText () {
    if (!this.status.running) {
      return "";
    } else if (!this.status.breaking) {
      return "🛇";
    }

    const msec = this.status.remainingBreakTime;
    const sec = Math.ceil(msec / 1000);
    return sec > 0 ? sec.toString() : "🛇";
  }

  // TODO remove because not used
  private get remainMinuteText () {
    if (!this.running) {
      return "";
    }

    const sec = (Date.now() - this.startedAt) / 1000;
    const min = sec / 60;
    const sMin = Math.floor(min).toString();
    return sMin;
  }

  constructor (private readonly status: Status) {
  }

  public async start () {
    this.tmInterval = setInterval(() => {
      this.updateBadge();
    }, 100);

    this.status.onChange((changes: any) => {
      this.updateBadge();
    });

    await this.status.init();

    this.updateBadge();
  }

  private updateBadge () {
    browser.browserAction.setBadgeText({
      text: this.badgeText,
    });
  }
}
