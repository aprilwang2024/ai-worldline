# Contributing to AI Worldline

Thank you for helping make the map more accurate. Contributions can add an event, improve an explanation, repair a source, translate interface copy, or fix the product itself.

## Before proposing an entry

Read [`EDITORIAL_POLICY.md`](./EDITORIAL_POLICY.md). A strong proposal identifies a durable change in the AI industry or its technical capabilities; popularity alone is not enough.

Use sources in this order whenever possible:

1. paper or technical report;
2. official documentation, release, or repository;
3. first-party engineering article or talk;
4. reliable reporting for adoption, financing, or market impact.

Do not copy abstracts or press releases into the summary. Write a short, attributable interpretation in your own words.

## Two ways to contribute

### Use an issue form

Choose **Suggest an event** if you have the evidence but do not want to edit the dataset. Choose **Correct an entry** for factual errors, broken sources, or disputed interpretation.

### Open a pull request

1. Fork the repository and create a focused branch.
2. Edit [`data/timeline.json`](./data/timeline.json). Keep one event change per pull request when practical.
3. Run:

   ```bash
   npm run validate
   npm run build:data
   npm test
   ```

4. Commit both `data/timeline.json` and the generated `timeline-data.js`.
5. Explain why the entry belongs, and identify the primary source in the pull request.

## Entry checklist

- `id` is stable, lowercase kebab-case.
- `period` matches the event date.
- `lane` is either `event` or `tech`.
- `topic` is optional and refers to a defined cross-cutting topic.
- `short` works as a one-line timeline label.
- `what`, `why`, and `changed` make distinct claims.
- at least one source is present, preferably primary.
- `fullText` points directly to a paper or full technical report when available.
- claims do not exceed what the sources support.

## Review expectations

Maintainers may accept the evidence but revise wording, move the entry between periods or lanes, or decline an item that duplicates an existing turning point. Disagreement is welcome when it is attached to evidence.

By contributing code, you agree to license it under MIT. By contributing data or editorial content, you agree to license it under CC BY 4.0.
