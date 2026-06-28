export type Environment = "development" | "staging" | "production";
export type ExecutionStatus = "success" | "error";
export type PromptLabel = "baseline" | "candidate" | "production";
export type LLMExecution = {
  traceId: string;
  userInput: string;
  sourceContext: string;
  promptName: string;
  promptVersion: number;
  promptLabel: PromptLabel;
  modelName: string;
  modelOutput: string;
  environment: Environment;
  status: ExecutionStatus;
  latencyMs: number;
  timestamp: string;
  errorMessage?: string;
  prompt: string;
};
export type ExecutionConfig = {
  environment: Environment;
  promptLabel: PromptLabel;
  modelName: string;
};
