import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://63caa7658aef638c94964b3d025fac18@o4511422770708480.ingest.de.sentry.io/4511422854398032",

  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  enableLogs: process.env.NODE_ENV !== "development",

  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1,

  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;