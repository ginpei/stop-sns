import Status from "../lib/Status.js";
import Timer from "./Timer.js";

const status = new Status();
const timer = new Timer(status);
timer.start();
