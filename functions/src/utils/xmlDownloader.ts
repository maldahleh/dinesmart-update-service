import {logger} from "firebase-functions";
import AdmZip = require("adm-zip");
import bent = require("bent");

const getBody = async (url: string) => {
  return await bent(url);
};

export default (url: string, completion: (res: string | null) => void) => {
  getBody(url)
      .then((body) => {
        logger.debug(`XML Body: ${body}`);
        const zip = new AdmZip(body);
        logger.debug(`XML Zip: ${zip}, entries=${zip.getEntries()}`);
        const file = zip.getEntries().find((entry: AdmZip.IZipEntry) =>
          entry.entryName.toLowerCase().endsWith(".xml"));
        logger.debug(`XML files: ${file}`);
        if (!file) {
          logger.error("No file found");
          completion(null);
          return;
        }

        completion(zip.readAsText(file, "utf-8"));
      })
      .catch((err) => {
        logger.error(`Error occurred: ${err}`);
        completion(null);
      });
};
