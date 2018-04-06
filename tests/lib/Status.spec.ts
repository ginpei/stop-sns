describe("Status", () => {
  const expect = chai.expect;
  let status: Status;

  beforeEach(async () => {
    status = new Status();
  });

  it("is OK", () => {
    expect(status).instanceof(Status);
  });
});
