// in order to deal with obj[prop]. any better way?
interface IAnyObj {
  [anyObjKey: string]: any;
}

function createElement(html: string) {
  const builder = document.createElement("div");
  builder.innerHTML = html.trim();
  const el = builder.firstElementChild as HTMLElement;
  // if (styles) {
  //   applyStyles(el, styles);
  // }
  return el;
}

class SnsBarrier {
  public async run() {
    if (await this.isRunning()) {
      this.showBarrier();
    }
  }

  public async isRunning() {
    // TODO find types
    // @ts-ignore
    const { running } = await browser.storage.local.get(["running"]);
    return running;
  }

  public reset() {
    const el = document.querySelector("#stopSns");
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }
    document.body.style.overflow = "";
  }

  public showBarrier() {
    this.reset();

    const el = this.buildElements();

    const okButton = el.querySelector(".stopSns-ok");
    if (okButton) {
      okButton.addEventListener("click", (event) => {
        this.reset();
      });
    }

    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
  }

  private buildElements() {
    return createElement(`
      <div id="stopSns">
        <div class="stopSns-content">
          <h1 class="stopSns-message">Stop SNS</h1>
          <div>
            <button class="stopSns-ok">Unleash your lust</button>
          </div>
        </div>
      </div>
    `);
  }
}

const barrierController = new SnsBarrier();
barrierController.run();
