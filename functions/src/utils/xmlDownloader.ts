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
  const body = await getBuffer(url).catch((err) => {
    throw err;
  });

  const cleanedBody = cleanResponse(body);
  const zip = new AdmZip(cleanedBody);
  const file = zip.getEntries().find((entry: AdmZip.IZipEntry) =>
    entry.entryName.toLowerCase().endsWith(".xml"));
  if (file === undefined) {
    throw new Error("No valid xml file found");
  }

  return Promise.resolve(zip.readAsText(file, "utf-8"));
};

export default downloadXml;
