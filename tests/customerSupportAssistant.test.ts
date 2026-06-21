import { describe, expect, it } from "vitest";
import { runCustomerSupportAssistant } from "../src/application/customerSupportAssistant.js";

describe("runCustomerSupportAssistant", () => {
  it("returns the answer and execution data", () => {
    const request = {
      userInput: "Can I return an opened product?",
      sourceContext:
        "Products can be returned within 14 days only if they are unused and unopened.",
      promptName: "customer-support-policy",
      promptVersion: 1,
    };

    const response = runCustomerSupportAssistant(request);

    expect(response.answer).toBe(request.sourceContext);

    expect(response.execution.userInput).toBe(request.userInput);
    expect(response.execution.sourceContext).toBe(request.sourceContext);
    expect(response.execution.promptName).toBe(request.promptName);
    expect(response.execution.promptVersion).toBe(request.promptVersion);

    expect(response.execution.promptLabel).toBe("baseline");
    expect(response.execution.modelName).toBe("mock-model");
    expect(response.execution.status).toBe("success");
    expect(response.execution.environment).toBe("development");
    expect(response.execution.latencyMs).toBe(0);

    expect(response.execution.traceId).not.toBe("");
    expect(response.execution.modelOutput).toBe(response.answer);
    expect(response.execution.timestamp).not.toBe("");
  });
});
