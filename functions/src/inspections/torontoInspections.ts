import {logger} from "firebase-functions";
import {parseString} from "xml2js";
import Location from "../models/location";
import addToStorage from "../storage/storageService";
import xmlDownloader from "../utils/xmlDownloader";
import TorontoInspectionResponse from "./models/torontoInspectionResponse";

const torontoDinesafeUrl = "http://opendata.toronto.ca/public.health/dinesafe/dinesafe.zip";

export default (completion: (res: boolean) => void) => {
  logger.info(`Attempting to download file: ${torontoDinesafeUrl}`);

  xmlDownloader(torontoDinesafeUrl, (text: string | null) => {
    if (!text) {
      logger.error(`No text: ${text}`);
      completion(false);
      return;
    }

    parseString(text, (err, result) => {
      if (err) {
        logger.error(`Parse string failed; text=${text} 
            err=${err} result=${result}`);

        completion(false);
        return;
      }

      const inspections: Record<string, Location> = {};
      result["ROWDATA"]["ROW"].forEach((res: TorontoInspectionResponse) => {
        let existingData = inspections[res["ESTABLISHMENT_ID"][0]];
        if (typeof existingData === "undefined") {
          existingData = {
            "name": res["ESTABLISHMENT_NAME"][0].trim(),
            "type": res["ESTABLISHMENTTYPE"][0],
            "address": res["ESTABLISHMENT_ADDRESS"][0].trim(),
            "coords": {
              "lat": res["LATITUDE"][0],
              "lon": res["LONGITUDE"][0],
            },
            "inspectionMap": {
            },
            "inspections": [],
          };
        }

        let inspectionData = existingData["inspectionMap"][res["INSPECTION_ID"][0]];
        if (typeof inspectionData === "undefined") {
          inspectionData = {
            "date": res["INSPECTION_DATE"][0],
            "status": res["ESTABLISHMENT_STATUS"][0],
            "infractions": [],
          };
        }

        const infractionDetails = res["INFRACTION_DETAILS"][0];
        if (infractionDetails !== "") {
          let severity = res["SEVERITY"][0];
          if (severity.startsWith("NA")) {
            severity = severity.substring(5);
          } else {
            severity = severity.substring(4);
          }

          inspectionData["infractions"].push({
            "details": infractionDetails,
            "severity": severity,
          });
        }

        existingData["inspectionMap"][res["INSPECTION_ID"][0]] = inspectionData;
        inspections[res["ESTABLISHMENT_ID"][0]] = existingData;
      });

      Object.keys(inspections).forEach((inspection) => {
        const inspectionArray = Object.values(
            inspections[inspection]["inspectionMap"]
        );

        inspectionArray.sort((a, b) => (b["date"] > a["date"]) ? 1 :
                    ((a["date"] > b["date"]) ? -1 : 0));

        inspections[inspection]["inspections"] = inspectionArray;
        inspections[inspection]["inspectionMap"] = {};

        addToStorage(inspection, inspections[inspection]);
      });

      completion(true);
    });
  });
};
