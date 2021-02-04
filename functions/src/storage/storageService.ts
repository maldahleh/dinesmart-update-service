import {Firestore} from "@google-cloud/firestore";

const firestore = new Firestore();

const storeLocation = (key: string, body: Location): void => {
  const document = firestore.doc(`inspections/${key}`);

  document.set(body);
};

export default storeLocation;
