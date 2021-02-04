import {logger} from "firebase-functions";
import AdmZip = require("adm-zip");
import arrayBufferToBuffer = require("arraybuffer-to-buffer");
import bent = require("bent");

const getBuffer = bent("buffer");

const cleanResponse = (input: Buffer | ArrayBuffer) => {
  if (input instanceof Buffer) {
    return input;
  }

  return arrayBufferToBuffer(input);
};

const downloadXml = async (url: string): Promise<string> => {
  const body = await getBuffer(url);
  logger.debug(`XML Body: ${body}`);
  if (!body) {
    const err = new Error("No valid body returned");
    return Promise.reject(err);
  }

  const cleanedBody = cleanResponse(body);
  const zip = new AdmZip(cleanedBody);
  const file = zip.getEntries().find((entry: AdmZip.IZipEntry) =>
    entry.entryName.toLowerCase().endsWith(".xml"));
  if (!file) {
    const err = new Error("No valid xml file found");
    return Promise.reject(err);
  }

  const xmlContent = zip.readAsText(file, "utf-8");
  logger.debug(`Found XML file. file=${file} content=${xmlContent}`);

  return Promise.resolve(xmlContent);
};

export default downloadXml;
