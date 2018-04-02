(async () => {
  const status = new Status();
  const snsBarrier = new SnsBarrier();

  function toggle () {
    if (status.running) {
      snsBarrier.show();
    } else {
      snsBarrier.reset();
    }
  }

  status.onChange(() => toggle());
  await status.init();
  toggle();
})();
