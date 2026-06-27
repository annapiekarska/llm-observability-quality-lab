import { LangfuseClient } from "@langfuse/client";
import type { PromptLabel } from "../types/llmObservability.js";

export type CompileCustomerSupportPromptInput = {
  sourceContext: string;
  userInput: string;
  promptLabel: PromptLabel;
};

export async function getCustomerSupportPrompt(
  params: CompileCustomerSupportPromptInput,
): Promise<string> {
  const langfuse = new LangfuseClient();
  const prompt = await langfuse.prompt.get("customer-support-policy", {
    label: params.promptLabel,
    type: "text",
    cacheTtlSeconds: 0,
  });
  const compiledPrompt = prompt.compile({
    sourceContext: params.sourceContext,
    userInput: params.userInput,
  });
  return compiledPrompt;
}
