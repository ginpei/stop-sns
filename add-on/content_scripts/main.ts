(async () => {
  const status = new Status();
  const snsBarrier = new SnsBarrier(status);

  function toggle () {
    if (status.running) {
      if (!status.breaking) {
        snsBarrier.show();
      }
    } else {
      snsBarrier.reset();
    }
  }

  status.onChange(() => toggle());
  await status.init();
  if (status.isTargetURL(location.href)) {
    toggle();
  }
})();
