import { sdk } from "./observability/instrumentation.js";
import { startActiveObservation } from "@langfuse/tracing";

async function firstTrace() {
  await startActiveObservation("customer-support-request", async (span) => {
    span.update({
      input: { userInput: "Can I return an opened product?" },
      output: {
        answer:
          "Products can be returned within 14 days only if they are unused and unopened.",
      },
    });
  });
  await sdk.shutdown();
}
firstTrace();
