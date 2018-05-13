import Status from "../lib/Status.js";

export default class OptionsUIController {
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

    this.elBreakTimeLengthMin.addEventListener("input", (event) => this.onBreakTimeLengthMinChange(event));
    this.elBreakTimeLengthMin.addEventListener("keydown", (event) => this.onBreakTimeLengthMinChange(event));

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

  private onBreakTimeLengthMinChange (event: Event) {
    // Edge doesn't recognize update when you use up/down keys.
    // They fixed that but not have shipped.
    // TODO remove keydown stuff and simplify when shipped
    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/14678823/
    const update = () => {
      const length = this.breakTimeLength;
      if (length > 0) {
        this.status.setBreakTimeLength(length);
      }
    };

    if (event.type === "keydown") {
      setTimeout(update, 1);
    } else {
      update();
    }
  }

  private render () {
    this.elRunningRow.setAttribute("data-status", this.status.text);

    const sBreakTimeLengthMin = Math.floor(this.status.breakTimeLength / 60 / 1000).toString();
    this.elBreakTimeLengthMin.value = sBreakTimeLengthMin;

    this.elMatches.value = this.status.matchesText;

    this.elRevert.disabled = !this.status.modified;
  }
}
