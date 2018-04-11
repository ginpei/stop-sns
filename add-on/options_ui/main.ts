(async () => {
  const status = new Status();
  await status.init();

  function update () {
    const elRunning = document.querySelector("#running");
    if (!elRunning) {
      throw new Error();
    }
    elRunning.textContent = status.running ? "Running" : "Resting :)";
  }

  status.onChange(() => {
    update();
  });

  update();
})();
