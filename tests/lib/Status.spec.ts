describe("Status", () => {
  const expect = chai.expect;

  class TestableStatus extends Status {
    constructor () {
      super();
      sinon.spy(this, "_spy_save");
    }

    public _spy_save () {
      return Promise.resolve();
    }

    public _test_setProps (values: any) {
      if (typeof values.running === "boolean") {
        this._running = values.running;
      }
      if (typeof values.startedBreakingAt === "number") {
        this._startedBreakingAt = values.startedBreakingAt;
      }
    }

    protected save () {
      return this._spy_save();
    }
  }

  let status: TestableStatus;

  beforeEach(async () => {
    status = new TestableStatus();
    status._test_setProps({
      running: false,
      startedBreakingAt: 0,
    });
  });

  describe("get breaking()", () => {
    it("returns true for non-0", () => {
      status._test_setProps({ startedBreakingAt: Date.now() });
      expect(status.breaking).to.eql(true);
    });

    it("returns false for 0", () => {
      status._test_setProps({ startedBreakingAt: 0 });
      expect(status.breaking).to.eql(false);
    });
  });

  describe("get remainingBreakTime()", () => {
    it("uses specified time length, which is 30,000", () => {
      expect(status.breakTimeLength).to.eql(30000);
    });

    it("returns remaining time in ms", () => {
      const clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status.startBreaking();
      clock.tick(10000);
      expect(status.remainingBreakTime).to.eql(20000);
    });

    it("returns 0 if not breaking", () => {
      status._test_setProps({ startedBreakingAt: 0 });
      expect(status.remainingBreakTime).to.eql(0);
    });
  });

  describe("start()", () => {
    beforeEach(() => {
      status._test_setProps({ running: false });
      status.start();
    });

    it("starts running", () => {
      expect(status.running).to.eql(true);
    });

    it("calls save()", () => {
      const spy = status._spy_save as sinon.SinonSpy;
      expect(spy).to.have.been.callCount(1);
    });
  });

  describe("stop()", () => {
    beforeEach(() => {
      status.start();
      status.startBreaking();
      const spy = status._spy_save as sinon.SinonSpy;
      spy.resetHistory();
      status.stop();
    });

    it("starts running", () => {
      expect(status.running).to.eql(false);
    });

    it("resets breaking time", () => {
      expect(status.startedBreakingAt).to.eql(0);
    });

    it("calls save()", () => {
      const spy = status._spy_save as sinon.SinonSpy;
      expect(spy).to.have.been.callCount(1);
    });
  });

  describe("startBreaking()", () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status._test_setProps({ startedBreakingAt: true });
      status.startBreaking();
    });

    it("remembers current date time", () => {
      const now = new Date("2000-01-01 12:34:56");
      expect(status.startedBreakingAt).to.eql(now.getTime());
    });

    it("calls save()", () => {
      const spy = status._spy_save as sinon.SinonSpy;
      expect(spy).to.have.been.callCount(1);
    });

    it("stops breaking after specified time length", () => {
      clock.tick(30000);
      expect(status.breaking).to.eql(false);
    });
  });

  describe("stopBreaking()", () => {
    beforeEach(() => {
      const now = new Date("2000-01-01 12:34:56");
      status._test_setProps({ startedBreakingAt: now.getTime() });
      status.stopBreaking();
    });

    it("resets date time", () => {
      expect(status.startedBreakingAt).to.eql(0);
    });

    it("calls save()", () => {
      const spy = status._spy_save as sinon.SinonSpy;
      expect(spy).to.have.been.callCount(1);
    });
  });
});
