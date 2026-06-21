# Project charter

## Business problem

A company uses a customer support assistant to answer questions about returns, refunds, shipping, order cancellations, and warranties.

The assistant must provide answers that are consistent with approved company policies. Changes to prompts may improve some responses while introducing regressions, hallucinations, unsupported claims, contradictions, incomplete answers, or irrelevant responses in others.

The team currently lacks a reliable way to:

- trace individual LLM executions,
- identify which prompt version generated a response,
- compare prompt versions on the same evaluation dataset,
- measure response quality consistently,
- detect regressions before release,
- identify cases requiring human review,
- make evidence-based release decisions.

Without this workflow, a prompt change may be promoted despite introducing customer-facing errors or policy violations.

## Project goal

The goal of this project is to build an observable LLM quality workflow that connects:

- prompt versions,
- runtime traces,
- evaluation scores,
- prompt regression testing,
- human review,
- quality gates,
- release recommendations.

The solution will demonstrate how Quality Engineering and AI Governance practices can be applied to LLM-based applications before prompt changes are promoted to production.

The project will use Langfuse as the primary observability and prompt management platform. Phoenix will be evaluated later through a limited comparison spike rather than a duplicate implementation.

## Target users

### Quality engineers

Quality engineers use the workflow to:

- design evaluation datasets,
- execute prompt regression tests,
- review failed and warning cases,
- validate quality gates,
- provide release recommendations.

### AI and software engineers

Engineers use the workflow to:

- trace LLM executions,
- identify failures,
- compare prompt versions,
- investigate regressions,
- understand which prompt, model, and configuration produced a response.

### Product managers

Product managers use the results to:

- understand the impact of prompt changes,
- review customer-facing risks,
- decide whether a change provides sufficient business value,
- support release prioritisation.

### Quality and governance leads

Quality and governance leads use the workflow to:

- define approval criteria,
- review evidence supporting release decisions,
- confirm that high-risk failures receive human review,
- maintain traceability between changes, evaluations, and release decisions,
- monitor adherence to the AI quality process.

## Key AI quality risks

### Hallucination

The assistant provides information that is not supported by the approved source context.

Example:

The policy does not mention contacting customer support, but the assistant states that the customer must call customer support to initiate a return.

### Unsupported claim

The response includes a claim that may be plausible but cannot be verified using the provided company policy.

### Contradiction

The response directly conflicts with the approved source context.

Example:

The policy allows returns within 14 days, but the assistant states that returns are not accepted.

### Incomplete answer

The response omits an important condition, limitation, or part of the approved policy.

Example:

The assistant mentions the 14-day return period but does not state that the product must be unused and unopened.

### Irrelevant answer

The response does not answer the user’s question or includes unrelated information.

### Prompt regression

A new prompt version improves some scenarios while reducing quality in others.

### Missing traceability

The team cannot identify which prompt version, model, or configuration generated a specific response.

### Unreviewed high-risk output

A response containing a critical quality issue is not escalated for human review before release.

## MVP scope

The MVP will include:

- a minimal customer support assistant,
- approved source context covering selected company policies,
- Langfuse tracing for LLM executions,
- prompt versioning,
- a baseline prompt,
- a candidate prompt,
- a regression evaluation dataset,
- response quality scores,
- prompt regression comparison,
- human review rules,
- quality gate logic,
- release recommendations,
- a human-readable regression report,
- CI/CD quality checks,
- a limited Phoenix comparison spike,
- documentation describing observability, evaluation, regression, and governance decisions.

The initial evaluation criteria will cover:

- groundedness,
- relevance,
- completeness,
- answer correctness,
- hallucination risk.

## Out of scope

The MVP will not include:

- model training,
- model fine-tuning,
- building a custom LLM,
- advanced machine learning pipelines,
- a production-scale RAG architecture,
- vector database implementation,
- complex multi-agent workflows,
- a full customer-facing user interface,
- production infrastructure,
- Kubernetes,
- large-scale load or performance testing,
- a complete duplicate implementation in Phoenix,
- fully automated AI governance,
- replacement of human release approval.

## Success criteria

The project will be considered complete when:

### Observability

- each LLM execution creates a trace,
- traces include input, output, prompt version, model information, environment metadata, latency, and execution status,
- failed executions can be identified and investigated,
- a response can be linked to the prompt version that generated it.

### Prompt management

- prompts are versioned,
- baseline and candidate prompt versions exist,
- prompt versions can be associated with traces,
- a controlled process exists for promoting a prompt version.

### Evaluation

- a representative regression dataset exists,
- responses are evaluated using defined quality criteria,
- evaluation scores are stored or linked to executions,
- critical cases are identified,
- cases requiring human review are clearly marked.

### Prompt regression testing

- baseline and candidate prompts are evaluated on the same dataset,
- improvements and regressions are identified,
- critical regressions block release,
- warning cases require review,
- a release recommendation is generated.

### Engineering quality

- automated tests pass,
- local quality checks are available,
- CI/CD executes the quality checks,
- a failed quality gate can block the pipeline,
- evaluation results are available as a report or build artifact.

### Governance

- approval criteria are documented,
- human review responsibilities are defined,
- release decisions are supported by evidence,
- prompt changes are traceable,
- project limitations and residual risks are documented.

### Tooling decision

- Langfuse is used as the primary observability and prompt management platform,
- Phoenix is evaluated through a limited practical spike,
- the Langfuse and Phoenix comparison is documented,
- the final tooling decision is supported by quality, governance, and maintainability requirements.
