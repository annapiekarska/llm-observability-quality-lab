import { sdk } from "./observability/instrumentation.js";
import { startActiveObservation, getActiveTraceId } from "@langfuse/tracing";
import { runCustomerSupportAssistant } from "./application/customerSupportAssistant.js";
import type { ExecutionConfig } from "./types/llmObservability.js";

async function firstTrace() {
  const executionConfig: ExecutionConfig = {
    environment: "development",
    promptLabel: "baseline",
    modelName: "mock-model",
    scenario: "return-policy",
  };
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
              model: executionConfig.modelName,
              metadata: {
                promptName: request.promptName,
                promptVersion: request.promptVersion,
                promptLabel: executionConfig.promptLabel,
                scenario: executionConfig.scenario,
              },
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
      metadata: {
        environment: executionConfig.environment,
        promptName: request.promptName,
        promptVersion: request.promptVersion,
        promptLabel: executionConfig.promptLabel,
        modelName: executionConfig.modelName,
        scenario: executionConfig.scenario,
      },
    });
  });
  await sdk.shutdown();
}
firstTrace();
