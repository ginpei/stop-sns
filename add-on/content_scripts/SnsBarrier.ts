class SnsBarrier {
  private tmShow = 0;

  constructor (private readonly status: Status) {
  }

  public reset () {
    clearTimeout(this.tmShow);

    const el = document.querySelector("#stopSns");
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }
    document.body.style.overflow = "";
  }

  public show () {
    this.reset();

    const el = this.buildElements();
    if (!el) {
      throw new Error("Failed to build the element");
    }

    const okButton = el.querySelector(".stopSns-ok");
    if (okButton) {
      okButton.addEventListener("click", (event) => {
        this.reset();
        this.startBreaking();
      });
    }

    document.body.appendChild(el);
    document.body.style.overflow = "hidden";
  }

  public startBreaking () {
    this.status.startBreaking();

    // break will be stopped by status
  }

  private buildElements () {
    function _createElement (html: string) {
      const builder = document.createElement("div");
      builder.innerHTML = html.trim();
      const el = builder.firstElementChild;
      return el;
    }

    const imagePath = browser.extension.getURL("/content_scripts/Road-sign-no-entry.svg");
    return _createElement(`
      <div id="stopSns">
        <div class="stopSns-content">
          <h1 class="stopSns-message">
            <img src="${imagePath}" width="300" height="300" />
          </h1>
          <div>
            <button class="stopSns-ok">Unleash your desire...</button>
          </div>
        </div>
      </div>
    `);
  }
}
