// eslint-disable-next-line import/no-unresolved
import {onSchedule} from "firebase-functions/v2/scheduler";
// eslint-disable-next-line import/no-unresolved
import {log, error} from "firebase-functions/logger";
import updateTorontoInspections from "./inspections/toronto/torontoInspections";

exports.updateData = onSchedule("every day 00:00", async () => {
  await updateTorontoInspections()
      .catch((err) => error(`Update failed. err=${err}`));

  log("Updated inspection data");
});
