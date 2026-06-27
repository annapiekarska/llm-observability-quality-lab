import { getCustomerSupportPrompt } from "./prompts/promptService.js";
import { customerSupportScenarios } from "../test-data/customerSupportScenarios.js";

async function main() {
  const scenario = customerSupportScenarios[0];
  if (!scenario) {
    throw new Error("Customer support scenario was not found");
  }
  const compiledPrompt = await getCustomerSupportPrompt({
    sourceContext: scenario.sourceContext,
    userInput: scenario.userInput,
    promptLabel: "baseline",
  });
  console.log(compiledPrompt);
}
await main();
