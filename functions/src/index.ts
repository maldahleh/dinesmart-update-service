// eslint-disable-next-line import/no-unresolved
import {onSchedule} from "firebase-functions/v2/scheduler";
// eslint-disable-next-line import/no-unresolved
import {log, error} from "firebase-functions/logger";
import * as opentelemetry from "@opentelemetry/api";
import updateTorontoInspections from "./inspections/toronto/torontoInspections";

exports.updateData = onSchedule({
  schedule: "every day 00:00",
  memory: "2GiB",
  timeoutSeconds: 600,
}, async () => {
  const tracer = opentelemetry.trace.getTracer(
      "update-data",
  );

  await tracer.startActiveSpan("updateTorontoInspections", async (span) => {
    await updateTorontoInspections()
        .catch((err) => error(`Update failed. err=${err}`));
    span.end();
  });

  log("Updated inspection data");
});
