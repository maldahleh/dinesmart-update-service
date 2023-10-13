import * as functions from "firebase-functions";
import updateTorontoInspections from "./inspections/toronto/torontoInspections";

export const main = functions.https.onRequest(async (_request, response) => {
    await updateTorontoInspections()
        .catch((err) => response.send(`Toronto: Inspection data update failed. err=${err}`));

    response.send("Inspection data updated");
});
