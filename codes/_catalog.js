const CODE_PATTERN = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/
const CATEGORY_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const ALLOWED_METHODS = new Set([
  'debug',
  'error',
  'info',
  'invariant',
  'rateLimit',
  'require',
  'timer',
  'warn',
  'warnOnce',
])
const DEFINITION_KEYS = new Set(['category', 'methods', 'summary'])

function deepFreeze(value, seen = new WeakSet()) {
  if (value == null || typeof value !== 'object' || seen.has(value)) return value

  seen.add(value)
  for (const key of Reflect.ownKeys(value)) {
    deepFreeze(value[key], seen)
  }
  return Object.freeze(value)
}

function assertDefinition(code, definition) {
  if (!definition || typeof definition !== 'object' || Array.isArray(definition)) {
    throw new TypeError(`Diagnostic code ${code} requires a definition object`)
  }

  const unknownKeys = Object.keys(definition).filter((key) => !DEFINITION_KEYS.has(key))
  if (unknownKeys.length > 0) {
    throw new TypeError(`Diagnostic code ${code} has unknown definition fields: ${unknownKeys.join(', ')}`)
  }

  const { category, methods, summary } = definition
  if (typeof category !== 'string' || !CATEGORY_PATTERN.test(category)) {
    throw new TypeError(`Diagnostic code ${code} requires a kebab-case category`)
  }
  if (!Array.isArray(methods) || methods.length === 0) {
    throw new TypeError(`Diagnostic code ${code} requires at least one diagnostics method`)
  }
  if (new Set(methods).size !== methods.length) {
    throw new TypeError(`Diagnostic code ${code} contains duplicate diagnostics methods`)
  }
  for (const method of methods) {
    if (!ALLOWED_METHODS.has(method)) {
      throw new TypeError(`Diagnostic code ${code} has unsupported diagnostics method: ${method}`)
    }
  }
  if (typeof summary !== 'string' || summary.trim().length === 0) {
    throw new TypeError(`Diagnostic code ${code} requires a non-empty summary`)
  }
}

export function createCatalog() {
  const entries = new Map()
  let finalized

  const define = (code, definition) => {
    if (finalized) {
      throw new Error('Diagnostic code catalog is already finalized')
    }
    if (typeof code !== 'string' || !CODE_PATTERN.test(code)) {
      throw new TypeError(`Invalid diagnostic code: ${String(code)}`)
    }
    if (entries.has(code)) {
      throw new Error(`Duplicate diagnostic code: ${code}`)
    }

    assertDefinition(code, definition)
    entries.set(code, deepFreeze({
      code,
      category: definition.category,
      methods: [...definition.methods],
      summary: definition.summary.trim(),
    }))
    return code
  }

  const finalize = () => {
    if (finalized) return finalized

    const codes = Object.fromEntries(
      [...entries.keys()].map((code) => [code, code]),
    )
    const definitions = Object.fromEntries(entries)
    finalized = deepFreeze({ codes, definitions })
    return finalized
  }

  return Object.freeze({ define, finalize })
}
