// @ts-ignore
if (!window.browser) {
  // @ts-ignore
  window.browser = window.chrome;
}

if (browser.storage.local.get.length === 1) {
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
