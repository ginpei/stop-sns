// allow Edge to overwrite methods
// (avoid "SCRIPT5045: Assignment to read-only properties is not allowed in strict mode")
try {
  // @ts-ignore
  if (window.browser) {
    browser.storage.local.get = browser.storage.local.get;
  }
} catch (error) {
  function cloneDeep (original: any) {
    if (typeof original !== "object" || original === null) {
      return original;
    }

    return Object.keys(original).reduce((obj: any, prop) => {
      obj[prop] = cloneDeep(original[prop]);
      return obj;
    }, {});
  }

  // allow overwrite
  // @ts-ignore
  window.chrome = cloneDeep(window.browser);

  // pretend Chrome
  // @ts-ignore
  window.browser = undefined;

  // add missing polyfill
  // @ts-ignore
  window.chrome.runtime.openOptionsPage = () => {
    const manifest = browser.runtime.getManifest();
    // @ts-ignore
    const url = manifest.options_page;
    browser.tabs.create({
      url: `/${url}`,
    });
  };
}