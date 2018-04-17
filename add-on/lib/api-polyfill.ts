// @ts-ignore
if (!window.browser) {
  // @ts-ignore
  window.browser = window.chrome;
}

// allow Edge to overwrite methods
// (avoid "SCRIPT5045: Assignment to read-only properties is not allowed in strict mode")
try {
  browser.storage.local.get = browser.storage.local.get;
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

  // @ts-ignore
  browser = cloneDeep(browser);
}

if (browser.storage.local.get.length === 0) {
  const original = browser.storage.local.get;
  // @ts-ignore
  // tslint:disable-next-line:only-arrow-functions
  browser.storage.local.get = function (keys: string[]) {
    return new Promise<browser.storage.StorageObject>((resolve, reject) => {
      // @ts-ignore
      original(keys, resolve);
    });
  };
}

if (browser.storage.local.set.length === 0) {
  const original = browser.storage.local.set;
  // @ts-ignore
  // tslint:disable-next-line:only-arrow-functions
  browser.storage.local.set = function (keys: browser.storage.StorageObject) {
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      original(keys, resolve);
    });
  };
}
