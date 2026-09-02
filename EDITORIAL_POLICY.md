# Editorial policy

AI Worldline is a curated research index. It aims to explain the sequence of meaningful changes in modern AI without pretending that selection or interpretation is neutral.

## What belongs

An entry should meet at least one of these tests:

- it introduced a technique or architecture that materially changed later systems;
- it made a previously specialist capability broadly usable;
- it changed how leading teams build, distribute, govern, or evaluate AI;
- it became an important open-source coordination point;
- it represents a durable institutional or commercial turn, not only a launch-day spike.

## What usually does not belong

- routine model refreshes without a meaningful capability or market shift;
- benchmark claims unsupported by a report or reproducible evidence;
- generic opinion pieces that did not shape research or practice;
- duplicate products that do not add a distinct turning point;
- rumors, anonymous screenshots, or retrospective claims with no attributable source.

## Two lanes, cross-cutting topics

Every entry has one primary lane:

- `event`: commercial, institutional, product, and adoption changes;
- `tech`: research, architecture, infrastructure, protocol, and open-source breakthroughs.

The public timeline currently exposes one slice across both lanes: `world-model` versus everything outside it. The canonical dataset can retain additional editorial tags for future research, but those tags should not become public filters without a clear reader need. A topic never becomes a third lane or implies a separate historical sequence.

Storylines are curated causal readings of canonical events. They should reuse existing event IDs, divide the path into meaningful phases, and explain why one change made the next possible. They are not a second place to store events.

## Source hierarchy

Primary sources come first: papers, technical reports, official documentation, release notes, repositories, and direct talks. Reliable reporting is appropriate for adoption, financing, internal organization, and other facts that first-party sources cannot independently establish.

Sources establish facts; the fields `why` and `changed` are editorial interpretation. Interpretations must be modest, specific, and open to correction.

## Ongoing periods

Use `status: "watching"` when the importance of an event is plausible but not settled. Watching entries may be revised or removed at the next half-year review.

## Corrections

Factual corrections should be made promptly and noted in [`CHANGELOG.md`](./CHANGELOG.md). Interpretive disagreements should identify the disputed sentence and provide a source or a clearer competing explanation. Material corrections do not require waiting for a scheduled release.

## Conflicts and attribution

Contributors should disclose direct employment, investment, or authorship relationships when proposing an entry about their own organization or work. Inclusion is based on evidence and historical relevance, not sponsorship.
