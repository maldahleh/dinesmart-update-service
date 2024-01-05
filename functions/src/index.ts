// eslint-disable-next-line import/no-unresolved
import {onSchedule} from "firebase-functions/v2/scheduler";
// eslint-disable-next-line import/no-unresolved
import {log, debug, error} from "firebase-functions/logger";
import updateTorontoInspections from "./inspections/toronto/torontoInspections";

exports.updateData = onSchedule({
  schedule: "every day 00:00",
  memory: "2GiB",
  timeoutSeconds: 600,
}, async () => {
  debug("Entered updateData");
  await updateTorontoInspections()
      .catch((err) => error(`Update failed. err=${err}`));

  log("Updated inspection data");
});
