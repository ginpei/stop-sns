enum PopupToggle {
  on = "on",
  off = "off",
}

class PopupController {
  public elToggle: HTMLElement;

  // set running (running: boolean) {
  //   if (running === this._running) {
  //     return;
  //   }

  //   if (running) {
  //     this.elToggle.setAttribute("data-bigSwitch-toggle", PopupToggle.on);
  //     this.status.start();
  //   } else {
  //     this.elToggle.setAttribute("data-bigSwitch-toggle", PopupToggle.off);
  //     this.status.stop();
  //   }

  // }

  constructor (public status: Status) {
    const elToggle = document.querySelector("#toggle");
    if (!(elToggle instanceof HTMLElement)) {
      throw new TypeError();
    }
    this.elToggle = elToggle;
  }

  public async start () {
    this.status.onChange(() => {
      this.update();
    });

    this.elToggle.addEventListener("click", (event) => {
      this.toggle();
    });

    await this.status.init();
    this.update();
  }

  public toggle () {
    if (this.status.running) {
      this.status.stop();
    } else {
      this.status.start();
    }
  }

  public update () {
    if (this.status.running) {
      this.elToggle.setAttribute("data-bigSwitch-toggle", PopupToggle.on);
    } else {
      this.elToggle.setAttribute("data-bigSwitch-toggle", PopupToggle.off);
    }
  }
}
