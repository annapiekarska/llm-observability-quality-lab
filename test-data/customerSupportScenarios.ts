export type CustomerSupportScenario = {
  id: string;
  scenario: string;
  userInput: string;
  sourceContext: string;
  promptName: string;
  promptVersion: number;
};

export const customerSupportScenarios: CustomerSupportScenario[] = [
  {
    id: "case-001",
    scenario: "return-policy",
    userInput: "Can I return an opened product?",
    sourceContext:
      "Products can be returned within 14 days only if they are unused and unopened.",
    promptName: "customer-support-policy",
    promptVersion: 1,
  },
  {
    id: "case-002",
    scenario: "shipping-policy",
    userInput: "How long does standard shipping take?",
    sourceContext: "Standard shipping takes 3 to 5 business days.",
    promptName: "customer-support-policy",
    promptVersion: 1,
  },
];
