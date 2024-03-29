import {logger} from "firebase-functions";
import fetch from "node-fetch";
import addToStorage from "../../storage/storageService";
import Inspection from "../../models/inspection";
import TorontoInspection from "./models/torontoInspection";
import Location from "../../models/location";

const targetUrl = "https://ckan0.cf.opendata.inter.prod-toronto.ca/dataset/ea1d6e57-87af-4e23-b722-6c1f5aa18a8d/resource/c573c64d-69b6-4d5b-988a-f3c6aa73f0b0/download/Dinesafe.json";

const compareInspectionDates = (a: Inspection, b: Inspection): number => {
  if (b.date > a.date) {
    return 1;
  } else if (a.date > b.date) {
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

export default async (): Promise<boolean> => {
  const inspections: Record<string, Location> = {};

  const getDataForEstablishment = (inspection: TorontoInspection): Location => {
    const existingData = inspections[inspection["Establishment ID"]];
    if (typeof existingData !== "undefined") {
      return existingData;
    }

    return {
      "name": inspection["Establishment Name"],
      "type": inspection["Establishment Type"],
      "address": inspection["Establishment Address"],
      "coords": {
        "lat": String(inspection.Latitude),
        "lon": String(inspection.Longitude),
      },
      "inspectionMap": {},
      "inspections": [],
    };
  };

  const buildEmptyInspection = (inspection: TorontoInspection): Inspection => {
    return {
      "date": inspection["Inspection Date"],
      "status": inspection["Establishment Status"],
      "infractions": [],
    };
  };

  const getDataForInspection = (
      inspection: TorontoInspection,
      inspections: Record<string, Inspection> | undefined,
  ): Inspection => {
    if (!inspections) {
      return buildEmptyInspection(inspection);
    }

    const inspectionData = inspections[inspection["Inspection ID"]];
    if (typeof inspectionData === "undefined") {
      return buildEmptyInspection(inspection);
    }

    return inspectionData;
  };

  const response = await fetch(targetUrl);
  const fetchedInspections = await response.json() as [TorontoInspection];
  fetchedInspections.forEach((inspection: TorontoInspection) => {
    const existingData = getDataForEstablishment(inspection);
    const inspectionMap = existingData.inspectionMap;
    const inspectionData = getDataForInspection(inspection, inspectionMap);

    const infractionDetails = inspection["Infraction Details"];
    if (infractionDetails !== "") {
      inspectionData.infractions.push({
        "details": infractionDetails,
        "severity": determineSeverity(inspection.Severity),
      });
    }

    if (inspectionMap) {
      inspectionMap[inspection["Inspection ID"]] = inspectionData;
    }
    inspections[inspection["Establishment ID"]] = existingData;
  });

  await Promise.all(Object.entries(inspections)
      .map(async ([establishmentId, location]) => {
        location.inspections = Object
            .values(location.inspectionMap ?? {})
            .sort(compareInspectionDates);

        delete location.inspectionMap;

        await addToStorage(establishmentId, location)
            .catch((err) => logger.error(`Error writing to DB: ${err}`));
      }));

  return Promise.resolve(true);
};
