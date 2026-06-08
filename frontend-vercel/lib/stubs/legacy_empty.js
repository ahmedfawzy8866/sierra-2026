// Sierra Estates Architecture — Turbopack Stub
// This file is used to resolve server-only packages to empty modules in the client/static-analysis bundle.

class NoOpClass {
  constructor(..._args) {}
  set() {}
  get() { return null; }
  remove() {}
  getMap() { return {}; }
  clone() { return new NoOpClass(); }
  start() {}
  shutdown() { return Promise.resolve(); }
  register() {}
  addSpanProcessor() {}
  getTracer() { return { startSpan: () => ({ end: () => {}, setAttribute: () => {}, setStatus: () => {} }) }; }
}

// Named exports covering common usage across grpc-js, opentelemetry, firebase-admin, etc.
module.exports = {
  Metadata: NoOpClass,
  OTLPTraceExporter: NoOpClass,
  NodeSDK: NoOpClass,
  BatchSpanProcessor: NoOpClass,
  SimpleSpanProcessor: NoOpClass,
  Resource: NoOpClass,
  resourceFromAttributes: () => ({}),
  trace: { getTracer: () => NoOpClass.prototype.getTracer(), getActiveSpan: () => null },
  SEMRESATTRS_PROJECT_NAME: 'service.name',
  default: {},
};
