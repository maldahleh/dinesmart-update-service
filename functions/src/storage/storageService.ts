import {Firestore} from "@google-cloud/firestore";
import DbLocation from "../models/dbLocation";

const firestore = new Firestore();

// key -> unique id of the establishment the inspection is associated with
export default async (key: string, body: DbLocation): Promise<void> => {
  const document = firestore.doc(`inspections/${key}`);

  await document.set(body);
};
