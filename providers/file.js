import {
  closeSync,
  mkdirSync,
  openSync,
  writeSync,
} from 'node:fs'
import path from 'node:path'

function normalizeForJson(value, ancestors = new Set()) {
  if (typeof value === 'bigint') return value.toString()
  if (value == null || typeof value !== 'object') return value

  if (ancestors.has(value)) return '[Circular]'
  ancestors.add(value)

  try {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? String(value) : value.toISOString()
    }

    if (value instanceof Error) {
      const normalized = {
        name: value.name || 'Error',
        message: value.message || String(value),
      }

      if (typeof value.stack === 'string' && value.stack) {
        normalized.stack = value.stack
      }
      if ('cause' in value && value.cause !== undefined) {
        normalized.cause = normalizeForJson(value.cause, ancestors)
      }
      if (value instanceof AggregateError) {
        normalized.errors = normalizeForJson(value.errors, ancestors)
      }

      for (const [key, entry] of Object.entries(value)) {
        if (!Object.hasOwn(normalized, key)) {
          normalized[key] = normalizeForJson(entry, ancestors)
        }
      }
      return normalized
    }

    if (Array.isArray(value)) {
      return value.map((entry) => normalizeForJson(entry, ancestors))
    }

    const normalized = {}
    for (const [key, entry] of Object.entries(value)) {
      normalized[key] = normalizeForJson(entry, ancestors)
    }
    return normalized
  } catch (error) {
    return `[Unserializable: ${error?.message ?? String(error)}]`
  } finally {
    ancestors.delete(value)
  }
}

function serialize(record) {
  return `${JSON.stringify(normalizeForJson(record))}\n`
}

/**
 * Create logger and metrics adapters that append newline-delimited JSON to one
 * file. Writes are synchronous because the diagnostics adapter interface is
 * synchronous; this also keeps each record together when multiple component
 * agent processes append to the same file.
 */
export function createFileDiagnosticsProvider({
  file,
  now = () => Date.now(),
  mode = 0o600,
  onWriteError,
} = {}) {
  const requestedFile = typeof file === 'string' ? file.trim() : ''
  if (!requestedFile) {
    throw new TypeError('file is required for the file diagnostics provider')
  }
  if (typeof now !== 'function') {
    throw new TypeError('now must be a function')
  }
  if (onWriteError !== undefined && typeof onWriteError !== 'function') {
    throw new TypeError('onWriteError must be a function when provided')
  }

  const resolvedFile = path.resolve(requestedFile)
  mkdirSync(path.dirname(resolvedFile), { recursive: true })
  let descriptor = openSync(resolvedFile, 'a', mode)

  const write = (record) => {
    if (descriptor === undefined) return
    try {
      writeSync(descriptor, serialize(record))
    } catch (error) {
      try { onWriteError?.(error, record) } catch { /* ignore adapter errors */ }
    }
  }

  const writeLog = (level, attributes) => {
    if (!attributes) return
    write({ ts: now(), kind: 'log', level, attributes })
  }

  return {
    file: resolvedFile,
    logger: {
      error(attributes) { writeLog('error', attributes) },
      warn(attributes) { writeLog('warn', attributes) },
      info(attributes) { writeLog('info', attributes) },
      debug(attributes) { writeLog('debug', attributes) },
    },
    metrics: {
      count(code, n = 1, attributes) {
        if (!code) return
        write({ ts: now(), kind: 'metric', type: 'count', code, n, attributes })
      },
      timing(name, ms, attributes) {
        if (!name || typeof ms !== 'number') return
        write({ ts: now(), kind: 'metric', type: 'timing', name, ms, attributes })
      },
    },
    close() {
      if (descriptor === undefined) return
      const openDescriptor = descriptor
      descriptor = undefined
      closeSync(openDescriptor)
    },
  }
}

export default createFileDiagnosticsProvider
