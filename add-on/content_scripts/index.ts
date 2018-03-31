'use strict';

namespace SnsBarrier {
  // in order to deal with obj[prop]. any better way?
  /* global AnyObj anyObjKey */
  interface AnyObj {
    [anyObjKey: string]: any
  }

  class SnsBarrier {
    async run () {
      if (await this.isRunning()) {
        this.showBarrier();
      }
    }

    async isRunning () {
      // TODO find types
      // @ts-ignore
      const { running } = await browser.storage.local.get(['running']);
      return running;
    }

    reset () {
      const el = document.querySelector('#stopSns');
      if (el && el.parentElement) {
        el.parentElement.removeChild(el);
      }
      document.body.style.overflow = '';
    }

    showBarrier () {
      this.reset();

      const el = createElement(`
        <div id="stopSns">
          <div class="stopSns-content">
            <h1 class="stopSns-message">Stop SNS</h1>
            <div>
              <button class="stopSns-ok">Unleash your lust</button>
            </div>
          </div>
        </div>
      `);

      const okButton = el.querySelector('.stopSns-ok');
      if (okButton) {
        okButton.addEventListener('click', (event) => {
          this.reset();
        });
      }

      document.body.appendChild(el);
      document.body.style.overflow = 'hidden';
    }
  }

  function createElement (html: string) {
    const builder = document.createElement('div');
    builder.innerHTML = html.trim();
    const el = builder.firstElementChild as HTMLElement;
    // if (styles) {
    //   applyStyles(el, styles);
    // }
    return el;
  }

  const controller = new SnsBarrier();
  controller.run();
}
