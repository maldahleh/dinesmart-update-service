import {Firestore} from "@google-cloud/firestore";
import {logger} from "firebase-functions";
import Location from "../models/location";

const firestore = new Firestore();

const storeLocation = (key: string, body: Location): void => {
  logger.debug(`Attempting DB write. key=${key} body=${body}`);
  firestore.collection("inspections").doc(`${key}`)
      .set(body)
      .then(() => {
        logger.info(`DB write succeeded. key=${key} content=${body}`);
      })
      .catch((err) => {
        logger.error(`Failed DB write. key=${key} body=${body} err=${err}`);
      });
};

export default storeLocation;
