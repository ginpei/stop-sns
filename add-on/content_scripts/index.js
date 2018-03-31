'use strict';
function kebabCase(source) {
    return source.replace(/[A-Z]/g, v => `-${v.toLowerCase()}`);
}
function applyStyles(el, styles) {
    if (!el || !(el instanceof HTMLElement)) {
        return;
    }
    const style = el.style;
    Object.keys(styles).forEach((prop) => {
        const value = styles[prop];
        const kebabProp = kebabCase(prop);
        style[kebabProp] = value;
    });
}
function createElement(html, styles) {
    const builder = document.createElement('div');
    builder.innerHTML = html.trim();
    const el = builder.firstElementChild;
    if (styles) {
        applyStyles(el, styles);
    }
    return el;
}
function reset() {
    const el = document.querySelector('#stopSns');
    if (el && el.parentElement) {
        el.parentElement.removeChild(el);
    }
    document.body.style.overflow = '';
}
function run() {
    reset();
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
            reset();
        });
    }
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
}
run();
//# sourceMappingURL=index.js.map