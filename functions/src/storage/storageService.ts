import {Firestore} from "@google-cloud/firestore";

const firestore = new Firestore();

export default (key: string, body: Location) => {
  const document = firestore.doc(`inspections/${key}`);

  document.set(body);
};
