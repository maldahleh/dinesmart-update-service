import {logger} from "firebase-functions";
import {parseStringPromise} from "xml2js";
import Location from "../models/location";
import addToStorage from "../storage/storageService";
import xmlDownloader from "../utils/xmlDownloader";
import TorontoInspectionResponse from "./models/torontoInspectionResponse";

const targetUrl = "http://opendata.toronto.ca/public.health/dinesafe/dinesafe.zip";

const updateTorontoInspections = async (): Promise<boolean> => {
  logger.info(`Attempting to download file: ${targetUrl}`);

  return await xmlDownloader(targetUrl)
      .then((res) => {
        logger.debug("Downloaded xml, parsing string");
        return parseStringPromise(res);
      })
      .then((xmlString) => {
        logger.debug(`XML string parsed. obj=${xmlString}`);
        const inspections: Record<string, Location> = {};
        const rows = xmlString["ROWDATA"]["ROW"];
        rows.forEach((res: TorontoInspectionResponse) => {
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

          const inspectionMap = existingData["inspectionMap"];
          let inspectionData = inspectionMap[res["INSPECTION_ID"][0]];
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

          inspectionMap[res["INSPECTION_ID"][0]] = inspectionData;
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

          const location = inspections[inspection];
          addToStorage(inspection, location);
        });

        return Promise.resolve(true);
      })
      .catch((err) => {
        throw err;
      });
};

export default updateTorontoInspections;
