import Status from "../lib/Status.js";

export default class PopupController {
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

    const elOpenOptionsPage = document.querySelector("#openOptionsPage");
    if (!elOpenOptionsPage) {
      throw new TypeError();
    }
    elOpenOptionsPage.addEventListener("click", () => {
      browser.runtime.openOptionsPage();
    });

    await this.status.init();
    this.update();
  }

  public toggle () {
    if (this.status.breaking) {
      this.status.stopBreaking();
    } else if (this.status.running) {
      this.status.stop();
    } else {
      this.status.start();
    }
  }

  public update () {
    this.elToggle.setAttribute("data-bigSwitch-status", this.status.text);

    // to force Edge to re-render
    this.elToggle.style.pointerEvents = "none";
    setTimeout(() => this.elToggle.style.pointerEvents = "", 1);
  }
}
