import {Firestore} from "@google-cloud/firestore";
import DbLocation from "./models/dbLocation";

const firestore = new Firestore();

const storeLocation = async (key: string, body: DbLocation): Promise<void> => {
  const document = firestore.doc(`inspections/${key}`);

  await document.set(body);
};

export default storeLocation;
