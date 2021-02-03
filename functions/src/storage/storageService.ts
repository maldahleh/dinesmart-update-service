const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore();

export default (key: string, body: any) => {
    const document = firestore.doc(`inspections/${key}`);

    document.set(body);
};