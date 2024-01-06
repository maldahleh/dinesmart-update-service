import * as opentelemetry from "@opentelemetry/sdk-node";
import {TraceExporter} from "@google-cloud/opentelemetry-cloud-trace-exporter";
import {HttpInstrumentation} from "@opentelemetry/instrumentation-http";
import {GrpcInstrumentation} from "@opentelemetry/instrumentation-grpc";
import {ExpressInstrumentation} from "opentelemetry-instrumentation-express";
import {gcpDetector} from "@opentelemetry/resource-detector-gcp";
import {
  CloudPropagator,
} from "@google-cloud/opentelemetry-cloud-trace-propagator";

if (!process.env.FUNCTIONS_EMULATOR) {
  const sdk = new opentelemetry.NodeSDK({
    instrumentations: [
      new HttpInstrumentation(),
      new GrpcInstrumentation(),
      new ExpressInstrumentation(),
    ],
    textMapPropagator: new CloudPropagator(),
    resourceDetectors: [gcpDetector],
    traceExporter: new TraceExporter(),
  });

  sdk.start();

  process.on("SIGTERM",
      async () => await sdk.shutdown());
}
