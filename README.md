# DineSmart Update Service
## Overview
The DineSmart Update Service is responsible for updating the DineSmart database with the latest restaurant health
inspection data.

### Supported Data Providers
Currently, this project supports the following data providers:
- City of Toronto

## Architecture
![architecture](./images/architecture.png)

## Deployment
This project is designed to be deployed as a Firebase Function

You must have Firestore set up on your Google Cloud account

You must set the `GOOGLE_APPLICATION_CREDENTIALS="[PATH]"` environment variable set, where `[PATH]` points to the
file path of the JSON file that contains your service account key.
