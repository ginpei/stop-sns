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

    // TODO replace with event system
    const interval = this.status.breakTimeLength;
    this.tmShow = setTimeout(() => {
      this.show();
    }, interval);
  }

  private buildElements () {
    function _createElement (html: string) {
      const builder = document.createElement("div");
      builder.innerHTML = html.trim();
      const el = builder.firstElementChild;
      return el;
    }

    return _createElement(`
      <div id="stopSns">
        <div class="stopSns-content">
          <h1 class="stopSns-message">🛇</h1>
          <div>
            <button class="stopSns-ok">Unleash your desire...</button>
          </div>
        </div>
      </div>
    `);
  }
}
