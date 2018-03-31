namespace Popup {
  enum PopupToggle {
    on = 'on',
    off = 'off',
  }

  class Popup {
    storage: MyStorage;
    elToggle = document.querySelector('#toggle')!;

    get running () {
      const sToggle = this.elToggle.getAttribute('data-bigSwitch-toggle');
      return sToggle === PopupToggle.on;
    }

    set running (running: boolean) {
      if (running !== this.running) {
        const sToggle = running ? PopupToggle.on : PopupToggle.off;
        this.elToggle.setAttribute('data-bigSwitch-toggle', sToggle);

        this.onRunningChange(running);
      }
    }

    constructor(options: { storage: MyStorage }) {
      this.storage = options.storage;
    }

    start () {
      this.storage.load().then((storage) => {
        this.running = storage.running;
      });

      this.elToggle.addEventListener('click', (event) => {
        this.toggle();
      });
    }

    toggle () {
      this.running = !this.running;
    }

    onRunningChange (running: boolean) {
      this.storage.save({ running });

      browser.runtime.sendMessage({ running, type: 'toggle' });
    }
  }

  interface Status {
    running: boolean
  }

  class MyStorage {
    async load () {
      // TODO find types
      // @ts-ignore
      return await browser.storage.local.get(['running']) as Status;
    }

    async save (status: Status) {
      // TODO find types
      // @ts-ignore
      await browser.storage.local.set(status);
    }
  }

  const myStorage = new MyStorage();
  const controller = new Popup({ storage: myStorage });
  controller.start();
}
