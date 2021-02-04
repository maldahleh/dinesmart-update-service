import {Firestore} from "@google-cloud/firestore";
import {logger} from "firebase-functions";
import Location from "../models/location";

const firestore = new Firestore();

const storeLocation = async (key: string, body: Location): Promise<void> => {
  logger.info(`Attempting DB write. key=${key} body=${body}`);
  await firestore.collection("inspections").doc(`${key}`).set(body)
      .catch((err) => {
        logger.error(`Failed DB write. key=${key} body=${body} err=${err}`);
      });

  logger.info(`DB write succeeded. key=${key} content=${body}`);
};

export default storeLocation;
