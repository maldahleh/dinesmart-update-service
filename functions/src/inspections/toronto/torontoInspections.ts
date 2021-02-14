import {logger} from "firebase-functions";
import {parseStringPromise} from "xml2js";
import Location from "../../models/location";
import addToStorage from "../../storage/storageService";
import xmlDownloader from "../../utils/xmlDownloader";
import TorontoInspectionResponse from "./models/torontoInspectionResponse";
import Inspection from "../../models/inspection";

const targetUrl = "http://opendata.toronto.ca/public.health/dinesafe/dinesafe.zip";

const compareInspectionDates = (a: Inspection, b: Inspection): number => {
  if (b["date"] > a["date"]) {
    return 1;
  } else if (a["date"] > b["date"]) {
    return -1;
  } else {
    return 0;
  }
};

const determineSeverity = (rawSeverity: string): string => {
  if (rawSeverity.startsWith("NA")) {
    return rawSeverity.substring(5);
  }

  return rawSeverity.substring(4);
};

const updateTorontoInspections = async (): Promise<boolean> => {
  const xml = await xmlDownloader(targetUrl).catch((err) => {
    throw err;
  });

  const xmlObject = await parseStringPromise(xml).catch((err) => {
    throw err;
  });

  const inspections: Record<string, Location> = {};
  const rows = xmlObject["ROWDATA"]["ROW"];
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
      inspectionData["infractions"].push({
        "details": infractionDetails,
        "severity": determineSeverity(res["SEVERITY"][0]),
      });
    }

    inspectionMap[res["INSPECTION_ID"][0]] = inspectionData;
    inspections[res["ESTABLISHMENT_ID"][0]] = existingData;
  });

  await Promise.all(Object.keys(inspections).map(async (inspection) => {
    inspections[inspection]["inspections"] = Object
        .values(inspections[inspection]["inspectionMap"])
        .sort(compareInspectionDates);
    inspections[inspection]["inspectionMap"] = {};

    const location = inspections[inspection];
    delete location.inspectionMap;

    await addToStorage(inspection, location).catch((err) => {
      logger.error(`Error writing to DB: ${err}`);
    });
  }));

  return Promise.resolve(true);
};

export default updateTorontoInspections;
