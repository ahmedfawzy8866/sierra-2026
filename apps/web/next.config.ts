import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

// Packages that use Node.js native binaries — must never be bundled client-side
const SERVER_ONLY_PACKAGES = [
  '@grpc/grpc-js',
  '@opentelemetry/exporter-trace-otlp-grpc',
  '@opentelemetry/exporter-trace-otlp-http',
  '@opentelemetry/exporter-logs-otlp-http',
  '@opentelemetry/sdk-node',
  '@opentelemetry/sdk-logs',
  '@opentelemetry/sdk-trace-node',
  '@opentelemetry/instrumentation-http',
  '@opentelemetry/instrumentation-express',
  'firebase-admin',
];


const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@grpc/grpc-js',
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/sdk-node',
    'firebase-admin',
  ],
  typescript: {
    // tsc --noEmit runs in the dedicated CI `type-check` job — that is the gate.
    // Skipping the redundant tsc pass here prevents OOM on memory-constrained CI
    // runners (Next.js spawns tsc in an isolated worker that ignores NODE_OPTIONS).
    ignoreBuildErrors: process.env.GITHUB_ACTIONS === 'true',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.firebasestorage.app' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      '@grpc/grpc-js': './lib/stubs/empty.js',
      '@opentelemetry/exporter-trace-otlp-grpc': './lib/stubs/empty.js',
      '@opentelemetry/exporter-trace-otlp-http': './lib/stubs/empty.js',
      '@opentelemetry/exporter-logs-otlp-http': './lib/stubs/empty.js',
      '@opentelemetry/sdk-node': './lib/stubs/empty.js',
      '@opentelemetry/sdk-logs': './lib/stubs/empty.js',
      '@opentelemetry/sdk-trace-node': './lib/stubs/empty.js',
      '@opentelemetry/instrumentation-http': './lib/stubs/empty.js',
      '@opentelemetry/instrumentation-express': './lib/stubs/empty.js',
      'firebase-admin': './lib/stubs/firebase-admin.js',
      'firebase-admin/firestore': './lib/stubs/empty.js',
      'firebase-admin/storage': './lib/stubs/empty.js',
    }
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Stub all server-only packages to empty modules in the browser bundle
      SERVER_ONLY_PACKAGES.forEach(pkg => {
        config.resolve.alias[pkg] = false;
      });
      config.resolve.alias['firebase-admin'] = false;
      config.resolve.alias['firebase-admin/firestore'] = false;
      config.resolve.alias['firebase-admin/storage'] = false;
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
