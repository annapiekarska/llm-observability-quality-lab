import { getActiveTraceId, startActiveObservation } from "@langfuse/tracing";
import { customerSupportScenarios } from "../test-data/customerSupportScenarios.js";
import { runCustomerSupportAssistant } from "./application/customerSupportAssistant.js";
import { sdk } from "./observability/instrumentation.js";
import type { ExecutionConfig } from "./types/llmObservability.js";
import type { CustomerSupportScenario } from "../test-data/customerSupportScenarios.js";
import { getCustomerSupportPrompt } from "./prompts/promptService.js";

const executionConfig: ExecutionConfig = {
  environment: "development",
  promptLabel: "baseline",
  modelName: "mock-model",
};

async function runScenario(scenario: CustomerSupportScenario): Promise<void> {
  await startActiveObservation("customer-support-request", async (span) => {
    const traceId = getActiveTraceId();

    if (!traceId) {
      throw new Error("Active trace ID was not found");
    }

    /* const request = {
      userInput: scenario.userInput,
      sourceContext: scenario.sourceContext,
      promptName: scenario.promptName,
      promptVersion: scenario.promptVersion,
      traceId,
      compiledPrompt,
    };*/
    const compiledPrompt = await getCustomerSupportPrompt({
      sourceContext: scenario.sourceContext,
      userInput: scenario.userInput,
      promptLabel: executionConfig.promptLabel,
    });
    const request = {
      userInput: scenario.userInput,
      sourceContext: scenario.sourceContext,
      promptName: scenario.promptName,
      promptVersion: scenario.promptVersion,
      traceId,
      compiledPrompt,
    };
    const response = await startActiveObservation(
      "run-customer-support-assistant",
      async (assistantSpan) => {
        const assistantResponse = await startActiveObservation(
          "generate-customer-support-answer",
          async (generation) => {
            const generatedResponse = runCustomerSupportAssistant(request);

            generation.update({
              input: {
                prompt: compiledPrompt,
                userInput: request.userInput,
                sourceContext: request.sourceContext,
              },
              output: generatedResponse,
              model: executionConfig.modelName,
              metadata: {
                scenarioId: scenario.id,
                scenario: scenario.scenario,
                promptName: request.promptName,
                promptVersion: request.promptVersion,
                promptLabel: executionConfig.promptLabel,
              },
            });

            return generatedResponse;
          },
          { asType: "generation" },
        );

        assistantSpan.update({
          input: request,
          output: assistantResponse,
          metadata: {
            scenarioId: scenario.id,
            scenario: scenario.scenario,
          },
        });

        return assistantResponse;
      },
    );

    span.update({
      input: request,
      output: response,
      metadata: {
        scenarioId: scenario.id,
        scenario: scenario.scenario,
        environment: executionConfig.environment,
        promptName: request.promptName,
        promptVersion: request.promptVersion,
        promptLabel: executionConfig.promptLabel,
        modelName: executionConfig.modelName,
      },
    });
  });
}

async function runDataset(): Promise<void> {
  try {
    for (const scenario of customerSupportScenarios) {
      await runScenario(scenario);
    }
  } finally {
    await sdk.shutdown();
  }
}

await runDataset();
