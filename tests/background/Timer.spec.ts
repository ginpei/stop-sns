describe("Timer", () => {
  const expect = chai.expect;

  let status: Status;
  let timer: Timer;

  beforeEach(() => {
    status = new Status();
    timer = new Timer(status);
  });

  describe("get badgeText()", () => {
    it("returns empty string if not running", () => {
      status.start();
      status.stop();
      expect(timer.badgeText).to.eql("");
    });

    it("returns stop mark if running", () => {
      status.start();
      expect(timer.badgeText).to.eql("🛇");
    });

    it("returns current remaining break time ceiled if breaking", () => {
      const clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status.start();
      status.startBreaking();
      clock.tick(29999);
      expect(timer.badgeText).to.eql("1");
    });

    it("returns stop mark after finishing a break", () => {
      const clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status.start();
      status.startBreaking();
      clock.tick(30000);
      expect(timer.badgeText).to.eql("🛇");
    });
  });
});
