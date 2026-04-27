# Feature spec: {short name}

<!--
  Copiar a `docs/<NOMBRE>.SPEC.md` (convención: nombre descriptivo + `.SPEC.md`).
  En este repo, ejemplos: `VIEWER_LAYOUT.SPEC.md`, `TIMELINE_LAYOUT.SPEC.md`.
  Reemplazar placeholders en el cuerpo.
-->

## Purpose

{One paragraph: what user or system problem this spec defines. When to read it (e.g. before changing X).}

## Scope

**In scope:** {List concrete responsibilities, code areas, or subsystems.}

**Out of scope:** {Point to other specs or “not this doc” items.}

## Behavior

{What the feature does from the product perspective: flows, UI, data, ordering rules. Subsections as needed.}

## Constraints and invariants

{Non-negotiables: invariants, forbidden patterns, performance or a11y floors. Short bullets. Optional short code sample if it carries the rule better than prose.}

## Testing and verification

{How to know a change is valid: manual checklist, unit/integration/E2E, property or snapshot—whatever applies. TDD or baseline-commit notes if relevant.}

## Related

- {Link to sibling spec(s) if the feature couples with them}
- [`AGENTS.md`](../AGENTS.md)
- {Cursor rules, ADRs, tickets—optional}

---

## Optional sections (use when useful)

- **Implementation order** — phased rollout, dependencies between steps (see `TIMELINE_LAYOUT.SPEC.md` for an example).
- **Open questions** — decisions deferred.
- **Changelog** — only if the spec is long-lived and you need a scratch history in-doc.
