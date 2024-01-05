import {onSchedule} from "firebase-functions/v2/scheduler";
import {logger} from "firebase-functions";
import updateTorontoInspections from "./inspections/toronto/torontoInspections";

exports.updateData = onSchedule("every day 00:00", async () => {
  await updateTorontoInspections()
      // eslint-disable-next-line max-len
      .catch((err) => logger.error(`Inspection data update failed. err=${err}`));

  logger.log("Updated inspection data");
});
