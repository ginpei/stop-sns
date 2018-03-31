namespace Timer {
  class Timer {
    startedAt = 0;
    tmInterval = 0;

    get running () {
      return !!this.startedAt;
    }

    private get remainMinuteText () {
      if (!this.running) {
        return '';
      }

      const sec = (Date.now() - this.startedAt) / 1000;
      const min = sec / 60;
      const sMin = Math.floor(min / 1000).toString();
      return sMin;
    }

    start () {
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
}
