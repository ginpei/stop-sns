class Timer {
  public startedAt = 0;
  public tmInterval = 0;

  get running() {
    return !!this.startedAt;
  }

  private get remainMinuteText() {
    if (!this.running) {
      return "";
    }

    const sec = (Date.now() - this.startedAt) / 1000;
    const min = sec / 60;
    const sMin = Math.floor(min).toString();
    return sMin;
  }

  public start() {
    this.tmInterval = setInterval(() => {
      this.updateBadge();
    }, 100);

    browser.runtime.onMessage.addListener((message: any) => {
      this.startedAt = message.running ? Date.now() : 0;
      this.updateBadge();
    });

    this.updateBadge();
  }

  private updateBadge() {
    browser.browserAction.setBadgeText({
      text: this.remainMinuteText,
    });
  }
}

const timer = new Timer();
timer.start();
