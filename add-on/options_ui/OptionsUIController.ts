class OptionsUIController {
  private readonly elRunningRow = document.querySelector("#runningRow")!;
  private readonly elBreakTimeLengthMin = document.querySelector("#breakTimeLength") as HTMLInputElement;
  private readonly elMatches = document.querySelector("#matches") as HTMLTextAreaElement;
  private readonly elReset = document.querySelector("#reset")!;
  private readonly elRevert = document.querySelector("#revert") as HTMLButtonElement;

  /**
   * (milliseconds)
   */
  get breakTimeLength () {
    return Number(this.elBreakTimeLengthMin.value) * 1000 * 60;
  }

  constructor (private readonly status: Status) {
  }

  public async start () {
    this.status.onChange(() => {
      this.render();
    });

    this.elBreakTimeLengthMin.addEventListener("input", () => {
      const length = this.breakTimeLength;
      if (length > 0) {
        this.status.setBreakTimeLength(length);
      }
    });

    this.elMatches.addEventListener("input", () => {
      this.status.setMatches(this.elMatches.value.split("\n"));
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

    const sBreakTimeLengthMin = Math.floor(this.status.breakTimeLength / 60 / 1000).toString();
    this.elBreakTimeLengthMin.value = sBreakTimeLengthMin;

    this.elMatches.value = this.status.matchesText;

    this.elRevert.disabled = !this.status.modified;
  }
}
