import SnsBarrier from "../../add-on/content_scripts/SnsBarrier.js";
import Status from "../../add-on/lib/Status.js";

export default () => {
  // @ts-ignore
  const sinon = window.sinon;

  const expect = chai.expect;
  let status: Status;
  let barrier: SnsBarrier;

  beforeEach(async () => {
    status = new Status();
    barrier = new SnsBarrier(status);
  });

  describe("startBreaking()", () => {
    it("shows barrier again specified break time later", () => {
      sinon.spy(status, "startBreaking");
      barrier.startBreaking();
      expect(status.startBreaking).to.have.been.callCount(1);
    });
  });
};
