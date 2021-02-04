import {Firestore} from "@google-cloud/firestore";
import Location from "../models/location";

const firestore = new Firestore();

const storeLocation = (key: string, body: Location): void => {
  const document = firestore.doc(`inspections/${key}`);

  document.set(body);
};

export default storeLocation;
