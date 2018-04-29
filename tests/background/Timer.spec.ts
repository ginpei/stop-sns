describe("Timer", () => {
  const expect = chai.expect;

  let status: Status;
  let timer: Timer;

  beforeEach(() => {
    status = new Status();
    timer = new Timer(status);
  });

  describe("get badgeText()", () => {
    beforeEach(() => {
      status.setBreakTimeLength(3 * 60 * 1000);  // 3 min
    });

    it("returns empty string if not running", () => {
      status.start();
      status.stop();
      expect(timer.badgeText).to.eql("");
    });

    it("returns stop mark if running", () => {
      status.start();
      expect(timer.badgeText).to.eql("🚫");
    });

    it("returns stop mark after finishing a break", () => {
      const clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status.start();
      status.startBreaking();
      clock.tick(3 * 60 * 1000);
      expect(timer.badgeText).to.eql("🚫");
    });

    describe("returns current remaining break time floored in min if breaking", () => {
      let clock: sinon.SinonFakeTimers;

      beforeEach(() => {
        clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
        status.start();
        status.startBreaking();
      });

      it("0 min 0.000 sec", () => {
        expect(timer.badgeText).to.eql("3");
      });

      it("0 min 0.001 sec", () => {
        clock.tick(1);
        expect(timer.badgeText).to.eql("3");
      });

      it("0 min 59.999 sec", () => {
        clock.tick(59 * 1000 + 999);
        expect(timer.badgeText).to.eql("3");
      });

      it("1 min 0.000 sec", () => {
        clock.tick(1 * 60 * 1000);
        expect(timer.badgeText).to.eql("2");
      });

      it("1 min 59.999 sec", () => {
        clock.tick(1 * 60 * 1000 + 59 * 1000 + 999);
        expect(timer.badgeText).to.eql("2");
      });
    });

    describe("returns current remaining break time ceiled in sec if breaking", () => {
      let clock: sinon.SinonFakeTimers;

      beforeEach(() => {
        clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
        status.start();
        status.startBreaking();
      });

      it("2 min 0.000 sec", () => {
        clock.tick(2 * 60 * 1000);
        expect(timer.badgeText).to.eql(".60");
      });

      it("2 min 59.999 sec", () => {
        clock.tick(2 * 60 * 1000 + 59 * 1000 + 999);
        expect(timer.badgeText).to.eql(".1");
      });
    });
  });
});
