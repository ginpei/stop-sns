(async () => {
  const status = new Status();
  await status.init();
  if (status.running) {
    const snsBarrier = new SnsBarrier();
    snsBarrier.run();
  }
})();
