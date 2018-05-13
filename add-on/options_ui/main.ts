import Status from "../lib/Status.js";
import OptionsUIController from "./OptionsUIController.js";

const status = new Status();
const controller = new OptionsUIController(status);
controller.start();
