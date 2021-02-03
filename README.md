# DineSmart Update Service
The DineSmart Update Service is responsible for updating the DineSmart database with the latest restaurant health inspection data.

## Deployment
DineSmart Update Service is designed to be deployed to a Google Cloud Function

You must have a Google Cloud Firestore service set up on your Google Cloud account

You must set the `GOOGLE_APPLICATION_CREDENTIALS="[PATH]"` environment variable, where `[PATH]` points to the file path of the JSON file that contains your service account key.