import { sdk } from "./observability/instrumentation.js";
import { startActiveObservation, getActiveTraceId } from "@langfuse/tracing";
import { runCustomerSupportAssistant } from "./application/customerSupportAssistant.js";

async function firstTrace() {
  await startActiveObservation("customer-support-request", async (span) => {
    const traceId = getActiveTraceId();
    if (!traceId) {
      throw new Error("active traceId was not found");
    }
    const request = {
      userInput: "Can I return an opened product?",
      sourceContext:
        "Products can be returned within 14 days only if they are unused and unopened.",
      promptName: "customer-support-policy",
      promptVersion: 1,
      traceId,
    };
    const response = await startActiveObservation(
      "run-customer-support-assistant",
      async (assistantSpan) => {
        const assistantResponse = await startActiveObservation(
          "generate-customer-support-answer",
          async (generation) => {
            const generatedResponse = runCustomerSupportAssistant(request);

            generation.update({
              input: request,
              output: generatedResponse,
              model: "mock-model",
            });
            return generatedResponse;
          },
          { asType: "generation" },
        );
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
