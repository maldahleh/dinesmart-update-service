import * as functions from "firebase-functions";
import updateTorontoInspections from "./inspections/torontoInspections";

export const main = functions.https.onRequest(async (_request, response) => {
  await updateTorontoInspections()
      .then(() => {
        response.send("Toronto: Inspection data updated");
      })
      .catch((err) => {
        response.send(`Toronto: Inspection data update failed. err=${err}`);
      });
});
