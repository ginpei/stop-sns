import Status from "../lib/Status.js";
import PopupController from "./PopupController.js";

const status = new Status();
const popupController = new PopupController(status);
popupController.start();
