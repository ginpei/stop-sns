class Timer {
  public startedAt = 0;
  public tmInterval = 0;

  get running () {
    return !!this.startedAt;
  }

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
    // TODO implement timers
    // this.tmInterval = setInterval(() => {
    //   this.updateBadge();
    // }, 100);

    this.status.onChange((changes: any) => {
      this.updateBadge();
    });

    await this.status.init();

    this.updateBadge();
  }

  private updateBadge () {
    browser.browserAction.setBadgeText({
      text: this.status.running ? "🛇" : "",
    });
  }
}
