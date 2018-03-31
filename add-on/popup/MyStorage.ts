class MyStorage {
  public async load() {
    // TODO find types
    // @ts-ignore
    return await browser.storage.local.get(["running"]) as IStatus;
  }

  public async save(status: IStatus) {
    // TODO find types
    // @ts-ignore
    await browser.storage.local.set(status);
  }
}
