"use client";

class SentryExampleFrontendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SentryExampleFrontendError";
  }
}

export default function SentryExamplePage() {
  const handleClick = () => {
    throw new SentryExampleFrontendError(
      "This error is raised on the frontend of the Sentry example page."
    );
  };

  return (
    <main style={{ padding: "48px" }}>
      <h1>Sentry example page</h1>

      <p>Click the button below to send a test error to Sentry.</p>

      <button type="button" onClick={handleClick}>
        Throw sample error
      </button>
    </main>
  );
}