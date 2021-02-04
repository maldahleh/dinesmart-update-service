import * as functions from "firebase-functions";
import updateTorontoInspections from "./inspections/torontoInspections";

export const main = functions.https.onRequest((_request, response) => {
  updateTorontoInspections((res) => {
    if (res) {
      response.send("Toronto: Inspection data updated");
    } else {
      response.send("Toronto: Inspection data update failed");
    }
  });
});
