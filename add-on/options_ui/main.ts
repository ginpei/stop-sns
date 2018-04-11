(async () => {
  const elRunningRow = document.querySelector("#runningRow");
  const elBreakTimeLengthSec = document.querySelector("#breakTimeLength") as HTMLInputElement | null;

  const status = new Status();
  const values = await status.init();

  function update () {
    if (!elRunningRow) {
      throw new Error();
    }
    elRunningRow.setAttribute("data-running", status.running.toString());

    if (!elBreakTimeLengthSec) {
      throw new Error();
    }
    elBreakTimeLengthSec.value = Math.floor(status.breakTimeLength / 1000).toString();
  }

  status.onChange(() => {
    update();
  });

  if (!elBreakTimeLengthSec) {
    throw new Error();
  }
  elBreakTimeLengthSec.addEventListener("input", () => {
    const length = Number(elBreakTimeLengthSec.value) * 1000;
    if (length > 0) {
      status.setBreakTimeLength(length);
    }
  });

  update();
})();
