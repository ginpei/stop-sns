class SnsBarrier {
  public reset () {
    const el = document.querySelector("#stopSns");
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }
    document.body.style.overflow = "";
  }

  public show () {
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

  private buildElements () {
    function _createElement (html: string) {
      const builder = document.createElement("div");
      builder.innerHTML = html.trim();
      const el = builder.firstElementChild as HTMLElement;
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
