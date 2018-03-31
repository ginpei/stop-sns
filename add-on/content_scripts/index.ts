'use strict';

// in order to deal with obj[prop]. any better way?
/* global AnyObj anyObjKey */
interface AnyObj {
  [anyObjKey: string]: any
}

function kebabCase (source: string) {
  return source.replace(/[A-Z]/g, v => `-${v.toLowerCase()}`);
}

function applyStyles (el: Element | null, styles: AnyObj) {
  if (!el || !(el instanceof HTMLElement)) {
    return;
  }

  const style = el.style as AnyObj;
  Object.keys(styles).forEach((prop) => {
    const value = styles[prop];
    const kebabProp = kebabCase(prop);
    style[kebabProp] = value;
  });
}

function createElement (html: string, styles?: object) {
  const builder = document.createElement('div');
  builder.innerHTML = html.trim();
  const el = builder.firstElementChild as HTMLElement;
  if (styles) {
    applyStyles(el, styles);
  }
  return el;
}

function reset () {
  const el = document.querySelector('#stopSns');
  if (el && el.parentElement) {
    el.parentElement.removeChild(el);
  }
  document.body.style.overflow = '';
}

function run () {
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
