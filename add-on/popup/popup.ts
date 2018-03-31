enum PopupToggle {
  on = "on",
  off = "off",
}

class Popup {
  public storage: MyStorage;
  public elToggle = document.querySelector("#toggle")!;

  get running () {
    const sToggle = this.elToggle.getAttribute("data-bigSwitch-toggle");
    return sToggle === PopupToggle.on;
  }

  set running (running: boolean) {
    if (running !== this.running) {
      const sToggle = running ? PopupToggle.on : PopupToggle.off;
      this.elToggle.setAttribute("data-bigSwitch-toggle", sToggle);

      this.onRunningChange(running);
    }
  }

  constructor (options: { storage: MyStorage }) {
    this.storage = options.storage;
  }

  public start () {
    this.storage.load().then((storage) => {
      this.running = storage.running;
    });

    this.elToggle.addEventListener("click", (event) => {
      this.toggle();
    });
  }

  public toggle () {
    this.running = !this.running;
  }

  public onRunningChange (running: boolean) {
    this.storage.save({ running });

    browser.runtime.sendMessage({ running, type: "toggle" });
  }
}

interface IStatus {
  running: boolean;
}

const myStorage = new MyStorage();
const popupController = new Popup({ storage: myStorage });
popupController.start();
