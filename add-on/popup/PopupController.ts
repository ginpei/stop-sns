enum PopupToggle {
  on = "on",
  off = "off",
}

class PopupController {
  public elToggle: HTMLElement;

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

    // to force Edge re-render
    this.elToggle.style.pointerEvents = "none";
    setTimeout(() => this.elToggle.style.pointerEvents = "", 1);
  }
}
