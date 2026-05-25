import 'server-only'; // ← Prevents this file from being imported by client components
import { NodeSDK } from "@opentelemetry/sdk-node";

import { resourceFromAttributes } from "@opentelemetry/resources";
import { SEMRESATTRS_PROJECT_NAME } from "@arizeai/openinference-semantic-conventions";
import { OTLPTraceExporter as GrpcOTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Metadata } from "@grpc/grpc-js";
import { trace, Tracer } from "@opentelemetry/api";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";

const metadata = new Metadata();
metadata.set("space-key", process.env.ARIZE_SPACE_ID || "");
metadata.set("api-key", process.env.ARIZE_API_KEY || "");

const arizeExporter = new GrpcOTLPTraceExporter({
  url: "https://otlp.arize.com:443",
  metadata: metadata as any,
});

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [SEMRESATTRS_PROJECT_NAME]: process.env.ARIZE_PROJECT_NAME || "sierra-blu-platform",
  }),
  spanProcessors: [
    new BatchSpanProcessor(arizeExporter)
  ],
});

export const initArize = () => {
  if (typeof window === "undefined") {
    try {
      sdk.start();
      console.log("📡 Arize Intelligence Pipeline Tracing Initialized");
    } catch (err) {
      console.error("❌ Failed to start Arize SDK", err);
    }
  }
};

export const getTracer = (): Tracer => {
  return trace.getTracer("sierra-blu-orchestrator");
};

/**
 * Wraps an agent function in an Arize Phoenix span for observability.
 * @param agentName - Name of the agent (e.g., 'scribe')
 * @param stage - Current stage (e.g., 'S1')
 * @param docId - Firestore document ID
 * @param fn - The function to execute
 */
export const instrumentAgent = async <T>(
  agentName: string,
  stage: string,
  docId: string,
  fn: () => Promise<T>
): Promise<T> => {
  const tracer = getTracer();
  return tracer.startActiveSpan(
    `${agentName}:${stage}`,
    {
      attributes: {
        "sierra_blu.agent": agentName,
        "sierra_blu.stage": stage,
        "sierra_blu.doc_id": docId,
        "openinference.span.kind": "CHAIN",
      },
    },
    async (span) => {
      try {
        const result = await fn();
        span.setStatus({ code: 0 }); // OK
        return result;
      } catch (error: any) {
        span.recordException(error);
        span.setStatus({ code: 2, message: error.message }); // Error
        throw error;
      } finally {
        span.end();
      }
    }
  );
};
