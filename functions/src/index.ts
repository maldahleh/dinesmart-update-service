import * as functions from 'firebase-functions';
import updateTorontoInspections from './inspections/torontoInspections';

export const main = functions.https.onRequest((_request, response) => {
    updateTorontoInspections();

    response.send("Inspection data updated");
});
