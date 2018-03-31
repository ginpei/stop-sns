enum PopupToggle {
  on = 'on',
  off = 'off',
}

class Popup {
  elToggle = document.querySelector('#toggle')!;

  get running () {
    const sToggle = this.elToggle.getAttribute('data-bigSwitch-toggle');
    return sToggle === PopupToggle.on;
  }

  set running (running: boolean) {
    const sToggle = running ? PopupToggle.on : PopupToggle.off;
    this.elToggle.setAttribute('data-bigSwitch-toggle', sToggle);
  }

  start () {
    this.elToggle.addEventListener('click', (event) => {
      this.toggle();
    });
  }

  toggle () {
    this.running = !this.running;
  }
}

const controller = new Popup();
controller.start();
