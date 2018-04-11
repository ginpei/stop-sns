class OptionsUIController {
  private readonly elRunningRow = document.querySelector("#runningRow")!;
  private readonly elBreakTimeLengthSec = document.querySelector("#breakTimeLength") as HTMLInputElement;
  private readonly elReset = document.querySelector("#reset")!;
  private readonly elRevert = document.querySelector("#revert") as HTMLButtonElement;

  /**
   * (milliseconds)
   */
  get breakTimeLength () {
    return Number(this.elBreakTimeLengthSec.value) * 1000;
  }

  constructor (private readonly status: Status) {
  }

  public async start () {
    this.status.onChange(() => {
      this.render();
    });

    this.elBreakTimeLengthSec.addEventListener("input", () => {
      const length = this.breakTimeLength;
      if (length > 0) {
        this.status.setBreakTimeLength(length);
      }
    });

    this.elReset.addEventListener("click", () => {
      this.status.reset();
    });

    this.elRevert.addEventListener("click", () => {
      this.status.revert();
    });

    await this.status.init();
    this.render();
  }

  private render () {
    const sRunning = this.status.running.toString();
    this.elRunningRow.setAttribute("data-running", sRunning);

    const sBreakTimeLengthSec = Math.floor(this.status.breakTimeLength / 1000).toString();
    this.elBreakTimeLengthSec.value = sBreakTimeLengthSec;

    this.elRevert.disabled = !this.status.modified;
  }
}
