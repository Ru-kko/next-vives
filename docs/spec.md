# Spec Driven Development (SDD)

> This proyect follow a Kiro-style flow: Requirements -> Design -> Tasks -> Code.
> Code is not written until the spec is human approved.

## Structure

Each new feature with (`"ssd": true` in `feature_list.json` or `features/<name>.md`) has a folder in `specs/<name>/` with the following files:

```
specs/<name>/
├── requirements.md   # What is needed (EARS notation)
├── design.md         # How it will be built (technical decisions)
└── tasks.md          # Concrete steps to implement
```

The `name` of the feature is the same as in `feature_list.json` or `features/<name>.md`.

## Feature States

| State | Description |
|-------|-------------|
| `pending` | Without specs. The `spec_author` should be the first to create them. |
| `spec_ready` | Spec has drafted. Waiting for human approval. |
| `in_progress` | Approved Spec. `implementer` is working on it. |
| `done` | Green Code, `reviewer` has approved. |
| `blocked` | The feature is blocked by an issue written in `progress/current.md` that needs to be resolved. |

## Human approval gate

The automatic flow must stop when `spec_author` ends its three files,
mark the feature as `spec_ready` and request human approval. The human
checks `specs/<name>` and if is ok says "approved". If not, (wants changes).

Only after human approval the `leader` transitions `spec_ready` -> `in_progress`
and calls the `implementer` to start coding.

```
pending → [spec_author] → spec_ready → ⏸ HUMANO → in_progress → [implementer → reviewer] → done
```

## requirements.md - Strict EARS

Requirements are written in EARS (Easy Approach to Requirements Syntax).
Every requirement is a single numerated sentence with following patterns:

| Pattern | Template |
|---------|----------|
| Ubiquitous | `The system SHALL <do something>.` |
| Event | `WHEN <dispatcher>, then <action>.` |
| State | `WHILE <state>, the system SHALL <do something>.` |
| Option | `IF <condition>, THEN <action>.` |
| Negative | `IF <unwanted behavior>, THEN the system SHALL <action>.` |

Rules:

- Each requirement has an unique identifier: `R<1>`, `R<2>`, `R<3>`, ..., `R<n>`.
- Each requirement must be testable and verifiable.
- Don't mix `SHALL` in the same requirement. If it's more than one option, split it.
- Don't use `SHOULD` or `MUST`. Use `SHALL` or `DO NOT SHALL`.

Example:

```markdown
## R1
WHEN the user clicks the "Submit" button, THEN the system SHALL validate the form data.
## R2
IF the form data is invalid, THEN the system SHALL display an error message.
```

## design.md - Technical Decisions

Implementation plan before coding:

- What files will be created or modified.
- What new contracts (functions, classes, interfaces, ...) will appear.
- What exceptions or errors will be reused or added.
- What alternative designs were considered and why they were rejected.
  
`docs/architecture.md`, `docs/conventions.md` and `docs/ui.md` must be followed. The
`design.md` document the points where your feature borders on those rules.

## tasks.md - Concrete Steps

Ordered list of discrete steps to implement the feature. Each task has a checkbox `[ ]` and reference almost one `R<n>` that it satisfies.

Example:

```markdown
- [ ] T1: Create the `User` class with properties `name` and `email`. (satisfies R1, R2)
- [ ] T2: Implement the `validateEmail` method. (satisfies R2)
```

The `implementer` will mark `[x]` each task as it is completed. The `reviewer` will reject if a task is not checked without an explanation.

## When not to use SDD

Features with `"ssd": false` in `feature_list.json` or `features/<name>.md` are not SDD.
