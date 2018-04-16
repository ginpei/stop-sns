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
      if (typeof values.breakTimeLength === "number") {
        this._breakTimeLength = values.breakTimeLength;
      }
      if (values.matches instanceof Array) {
        this._matches = values.matches;
      }
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
      breakTimeLength: 1 * 60 * 1000,
        matches: [
          "twitter.com",
          "facebook.com",
        ],
      running: false,
      startedBreakingAt: 0,
    });
  });

  describe("get filtersText()", () => {
    it("returns all items joined by line breaks", () => {
      status._test_setProps({
        matches: ["a", "b", "c"],
      });
      expect(status.matchesText).to.eql("a\nb\nc");
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
    it("returns remaining time in ms", () => {
      const clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status.startBreaking();
      clock.tick(10000);
      expect(status.remainingBreakTime).to.eql(50000);
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
      sinon.spy(status, "stopBreaking");
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

    it("kills a timer that stops break time", () => {
      expect(status.stopBreaking).to.have.been.callCount(1);
    });
  });

  describe("startBreaking()", () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
      sinon.spy(status, "stopBreaking");
      clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      status.startBreaking();
    });

    it("remembers current date time", () => {
      const now = new Date("2000-01-01 12:34:56");
      expect(status.startedBreakingAt).to.eql(now.getTime());
    });

    it("stops breaking after specified time length", () => {
      clock.tick(60000);
      expect(status.breaking).to.eql(false);
    });

    it("kills an old timer", () => {
      status.startBreaking();
      clock.tick(60000);
      expect(status.stopBreaking).to.have.been.callCount(1);
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

  describe("setBreakTimeLength", () => {
    it("sets value", () => {
      status.setBreakTimeLength(10000);
      expect(status.breakTimeLength).to.eql(10000);
    });

    it("throws if negative value", () => {
      expect(() => status.setBreakTimeLength(-1)).to.throw();
    });
  });

  describe("isTargetURL()", () => {
    beforeEach(() => {
      status._test_setProps({
        matches: [
          "twitter.com",
          "",  // make sure it works even if includes empty
          "facebook.com",
        ],
      });
    });

    it("matches with the hostname", () => {
      expect(status.isTargetURL("https://twitter.com/")).to.eql(true);
    });

    it("matches with URLs followed by paths", () => {
      expect(status.isTargetURL("https://twitter.com/ginpei_jp/lists")).to.eql(true);
    });

    it("matches with a hostname with sub domain", () => {
      expect(status.isTargetURL("https://mobile.twitter.com/")).to.eql(true);
    });

    it("matches with URLs with any protocols", () => {
      expect(status.isTargetURL("http://twitter.com/")).to.eql(true);
      expect(status.isTargetURL("ftp://twitter.com/")).to.eql(true);
    });

    it("matches with URLs with any ports", () => {
      expect(status.isTargetURL("https://twitter.com:80/")).to.eql(true);
      expect(status.isTargetURL("https://twitter.com:8080/")).to.eql(true);
    });

    it("doesn't match with unlisted hostname", () => {
      expect(status.isTargetURL("https://ginpei.info/")).to.eql(false);
      expect(status.isTargetURL("http://localhost:7357/6579")).to.eql(false);
    });

    it("doesn't match if just a part", () => {
      expect(status.isTargetURL("https://super-twitter.com/")).to.eql(false);
      expect(status.isTargetURL("https://twitter.com.local/")).to.eql(false);
      expect(status.isTargetURL("https://twitter.comcomcom.com/")).to.eql(false);
    });

    it("matches the second one in the list", () => {
      expect(status.isTargetURL("https://www.facebook.com/")).to.eql(true);
    });
  });
});
