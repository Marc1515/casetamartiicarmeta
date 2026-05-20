import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://63caa7658aef638c94964b3d025fac18@o4511422770708480.ingest.de.sentry.io/4511422854398032",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  enableLogs: process.env.NODE_ENV !== "development",

  sendDefaultPii: false,
});