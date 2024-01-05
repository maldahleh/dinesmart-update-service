import {Firestore} from "@google-cloud/firestore";
import Location from "../models/location";

const firestore = new Firestore();

// key -> unique id of the establishment the inspection is associated with
export default async (key: string, body: Location): Promise<void> => {
  const document = firestore.doc(`inspections/${key}`);

  await document.set(body);
};
