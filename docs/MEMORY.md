# Long-Term Project Memory

This is the design for durable, repository-local memory across OpenCode sessions. It
preserves decisions and context without making markdown the system of record for
Virtus business data.

## Design

```text
source or session
       |
       v
capture -> classify -> verify -> record -> index
                                      |
                                      v
                              retrieve -> verify again -> act
```

The memory system is append-oriented: new evidence creates or supersedes a record;
old decisions are not silently erased.

## Structure

```text
docs/
  MEMORY.md                 # rules, schema, retrieval order
  memory/
    INDEX.md                # links to active records and current open questions
    decisions/              # architecture and product decisions
    domains/                # stable domain facts and boundaries
    workflows/              # verified end-to-end flows and invariants
    operations/             # setup, deployment, security, and recovery knowledge
    sessions/               # short summaries of durable outcomes from work sessions
    open-questions/         # unresolved choices with an owner and next action
```

Use the category that best matches the record. Keep the index current when adding,
superseding, or resolving a record.

## Record Format

Each record should be a small Markdown file with this metadata:

```yaml
id: decision-0001
type: decision
title: Human-readable title
status: active
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: path/to/source-or-session
confidence: confirmed
supersedes: null
```

Use `type` values `decision`, `fact`, `workflow`, `operation`, `session`, or
`question`. Use `status` values `active`, `proposed`, `resolved`, or `superseded`.
After the metadata, use only the sections needed: `Context`, `Record`,
`Consequences`, `Evidence`, `Related`, and `Next Action`.

## Rules

- Record verified, reusable context, not a transcript of conversation.
- Cite the source path, command output, or user decision that supports each important claim.
- Keep application truth in the future database and source code; memory notes explain decisions and operating context.
- Store no secrets, tokens, passwords, personal data, or unredacted customer information.
- Mark uncertain proposals and questions clearly; never present them as settled facts.
- For a changed decision, create a new record with `supersedes` and update the index.
- Session notes should contain only durable outcomes, files changed, verification performed, and follow-up work.
- Review memory before planning work and after completing work so stale assumptions are not carried forward.

## Retrieval Order

1. Read `docs/memory/INDEX.md`.
2. Read relevant active domain, workflow, and operation records.
3. Read decisions that govern the requested change.
4. Verify claims against executable repository sources once they exist.
5. Read recent session notes only for context that is not already canonical.

## Virtus OS Boundary

The future assistant may use this memory to select context and explain decisions, but
it must still call defined application operations, pass server-side authorization, and
write audit events for actions. Memory must never bypass permissions or replace the
PostgreSQL system of record described in the master planning document.
