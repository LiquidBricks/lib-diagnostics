# Diagnostic Code Catalog

This directory is the source of truth for machine-readable diagnostic codes emitted by the current platform.

Application code should import the exact codes it uses:

```js
import {
  PRECONDITION_REQUIRED,
  TIMER_GENERIC_OPERATION,
} from '@liquid-bricks/lib-diagnostics/codes'

diagnostics.require(
  value,
  PRECONDITION_REQUIRED,
  'value is required',
  { field: 'value' },
)

const timer = diagnostics.timer(
  'GENERIC_OPERATION',
  { subject },
  { code: TIMER_GENERIC_OPERATION },
)
```

Named exports are primitive strings, so they work with the existing diagnostics API, loggers, metrics adapters, and `DiagnosticError`. The export name and emitted value are always identical.

## Analysis API

The same module exports two immutable, JSON-serializable indexes:

```js
import { codes, definitions } from '@liquid-bricks/lib-diagnostics/codes'

console.log(codes.PRECONDITION_REQUIRED)
// PRECONDITION_REQUIRED

console.log(definitions.PRECONDITION_REQUIRED)
// {
//   code: 'PRECONDITION_REQUIRED',
//   category: 'precondition',
//   methods: ['require'],
//   summary: 'A required precondition value was absent.'
// }
```

- `codes` enumerates every canonical code as `{ [code]: code }`.
- `definitions` describes the code's stable category, current diagnostics methods, and meaning.
- Both indexes, every definition, and nested method arrays are frozen.

The `methods` field records how production code currently emits the code. It is descriptive catalog information, not runtime enforcement at a diagnostics call site.

## Adding a code

Add a code only when production code emits it through a code-bearing diagnostics path. Define it once in `index.js`, add a concise context-independent summary, and import the named export at every call site.

Catalog validation requires:

- a unique `SCREAMING_SNAKE_CASE` identifier;
- an emitted string identical to the export name;
- a kebab-case category;
- one or more supported diagnostics methods;
- a non-empty summary.

Do not add dead declarations, example-only strings, or codes used exclusively on ordinary `Error` objects. Timers are special: `diagnostics.timer(name)` retains its `TIMER_${name}` fallback, but production callers should pass a cataloged emitted code through the optional third `{ code }` argument.
