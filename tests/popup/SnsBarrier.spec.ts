describe("SnsBarrier", () => {
  const expect = chai.expect;
  let barrier: SnsBarrier;

  beforeEach(async () => {
    const status = new Status();
    barrier = new SnsBarrier(status);
  });

  it("is OK", () => {
    expect(barrier).instanceof(SnsBarrier);
  });
});
