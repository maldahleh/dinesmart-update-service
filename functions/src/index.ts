// eslint-disable-next-line import/no-unresolved
import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions";
import updateTorontoInspections from "./inspections/toronto/torontoInspections";

exports.updateData = onSchedule("every day 00:00", async () => {
  await updateTorontoInspections()
      .catch((err) => logger.error(`Update failed. err=${err}`));

  logger.log("Updated inspection data");
});
