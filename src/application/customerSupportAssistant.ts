import { randomUUID } from "node:crypto";
import type { LLMExecution } from "../types/llmObservability.js";

export type CustomerSupportRequest = {
  userInput: string;
  sourceContext: string;
  promptName: string;
  promptVersion: number;
};
export type CustomerSupportResponse = {
  answer: string;
  execution: LLMExecution;
};

export const runCustomerSupportAssistant = (
  request: CustomerSupportRequest,
): CustomerSupportResponse => {
  const answer = request.sourceContext;

  const execution: LLMExecution = {
    traceId: randomUUID(),
    userInput: request.userInput,
    sourceContext: request.sourceContext,
    promptName: request.promptName,
    promptVersion: request.promptVersion,
    promptLabel: "baseline",
    modelName: "mock-model",
    modelOutput: answer,
    environment: "development",
    status: "success",
    latencyMs: 0,
    timestamp: new Date().toISOString(),
  };

  return {
    answer,
    execution,
  };
};
