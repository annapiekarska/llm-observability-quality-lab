import { sdk } from "./observability/instrumentation.js";
import { startActiveObservation } from "@langfuse/tracing";
import { runCustomerSupportAssistant } from "./application/customerSupportAssistant.js";

async function firstTrace() {
  await startActiveObservation("customer-support-request", async (span) => {
    const request = {
      userInput: "Can I return an opened product?",
      sourceContext:
        "Products can be returned within 14 days only if they are unused and unopened.",
      promptName: "customer-support-policy",
      promptVersion: 1,
    };
    const response = await startActiveObservation(
      "run-customer-support-assistant",
      async (assistantSpan) => {
        const assistantResponse = runCustomerSupportAssistant(request);
        assistantSpan.update({
          input: request,
          output: assistantResponse,
        });
        return assistantResponse;
      },
    );
    span.update({
      input: request,
      output: response,
    });
  });
  await sdk.shutdown();
}
firstTrace();
