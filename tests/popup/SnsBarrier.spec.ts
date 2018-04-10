describe("SnsBarrier", () => {
  const expect = chai.expect;
  let status: Status;
  let barrier: SnsBarrier;

  beforeEach(async () => {
    status = new Status();
    barrier = new SnsBarrier(status);
  });

  describe("startBreaking()", () => {
    it("shows barrier again specified break time later", () => {
      sinon.spy(barrier, "show");
      const clock = sinon.useFakeTimers(new Date("2000-01-01 12:34:56"));
      barrier.startBreaking();
      clock.tick(status.breakTimeLength);
      expect(barrier.show).to.have.been.callCount(1);
    });
  });
});
