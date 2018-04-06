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

  describe("get breakingTime()", () => {
    it("returns elapsed time in ms", () => {
      const clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status._test_setProps({ startedBreakingAt: Date.now() });
      clock.tick(10000);
      expect(status.breakingTime).to.eql(10000);
    });

    it("returns -1 if not breaking", () => {
      status._test_setProps({ startedBreakingAt: 0 });
      expect(status.breakingTime).to.eql(-1);
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
      status._test_setProps({ running: true });
      status.stop();
    });

    it("starts running", () => {
      expect(status.running).to.eql(false);
    });

    it("calls save()", () => {
      const spy = status._spy_save as sinon.SinonSpy;
      expect(spy).to.have.been.callCount(1);
    });
  });

  // TODO fix typo
  describe("startBreaking()", () => {
    beforeEach(() => {
      sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status._test_setProps({ startedBreakingAt: true });
      status.startBraking();
    });

    it("remembers current date time", () => {
      const now = new Date("2000-01-01 12:34:56");
      expect(status.startedBreakingAt).to.eql(now.getTime());
    });

    it("calls save()", () => {
      const spy = status._spy_save as sinon.SinonSpy;
      expect(spy).to.have.been.callCount(1);
    });
  });

  // TODO fix typo
  describe("stopBreaking()", () => {
    beforeEach(() => {
      const now = new Date("2000-01-01 12:34:56");
      status._test_setProps({ startedBreakingAt: now.getTime() });
      status.stopBraking();
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
