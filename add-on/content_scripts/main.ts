import Status from "../lib/Status.js";
import SnsBarrier from "./SnsBarrier.js";

(async () => {
  const status = new Status();
  const snsBarrier = new SnsBarrier(status);

  function toggle () {
    if (status.isTargetURL(location.href) && status.running) {
      if (!status.breaking) {
        snsBarrier.show();
      }
    } else {
      snsBarrier.reset();
    }
  }

  status.onChange(() => toggle());
  await status.init();
  toggle();
})();
