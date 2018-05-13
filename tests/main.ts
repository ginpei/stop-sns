import TimerSpec from "./background/Timer.spec.js";
import StatusSpec from "./lib/Status.spec.js";
import SnsBarrierSpec from "./popup/SnsBarrier.spec.js";

describe("Timer", TimerSpec);
describe("Status", StatusSpec);
describe("SnsBarrier", SnsBarrierSpec);

mocha.run();
