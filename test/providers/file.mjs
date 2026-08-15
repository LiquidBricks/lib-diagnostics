import assert from 'node:assert/strict'
import {
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import createFileDiagnosticsProvider, {
  createFileDiagnosticsProvider as createNamedFileDiagnosticsProvider,
} from '../../providers/file.js'

function readRecords(file) {
  return readFileSync(file, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

test('file provider exports its factory as named and default', () => {
  assert.equal(createFileDiagnosticsProvider, createNamedFileDiagnosticsProvider)
})

test('file provider writes log and metric NDJSON records', (t) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'lib-diagnostics-file-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const file = path.join(directory, 'nested', 'diagnostics.ndjson')
  const provider = createFileDiagnosticsProvider({
    file,
    now: () => 1234,
  })

  provider.logger.warn({ code: 'WARN', msg: 'warning' })
  provider.metrics.count('WARN', 1, { source: 'test' })
  provider.metrics.timing('load', 42, { source: 'test' })
  provider.close()
  provider.close()
  provider.logger.info({ msg: 'closed providers ignore new records' })

  assert.equal(provider.file, file)
  assert.deepEqual(readRecords(file), [
    {
      ts: 1234,
      kind: 'log',
      level: 'warn',
      attributes: { code: 'WARN', msg: 'warning' },
    },
    {
      ts: 1234,
      kind: 'metric',
      type: 'count',
      code: 'WARN',
      n: 1,
      attributes: { source: 'test' },
    },
    {
      ts: 1234,
      kind: 'metric',
      type: 'timing',
      name: 'load',
      ms: 42,
      attributes: { source: 'test' },
    },
  ])
})

test('file provider preserves Error details and safely handles cycles', (t) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'lib-diagnostics-error-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const file = path.join(directory, 'diagnostics.ndjson')
  const provider = createFileDiagnosticsProvider({ file, now: () => 5678 })
  const cause = new Error('podman failed')
  cause.code = 'E_COMMAND'
  cause.stderr = 'container not found'
  const error = new Error('inspect failed', { cause })
  error.stdout = '[]'
  const circular = { label: 'root' }
  circular.self = circular

  provider.logger.error({ msg: 'router error', meta: { error, circular } })
  provider.close()

  const [record] = readRecords(file)
  assert.equal(record.ts, 5678)
  assert.equal(record.attributes.meta.error.name, 'Error')
  assert.equal(record.attributes.meta.error.message, 'inspect failed')
  assert.match(record.attributes.meta.error.stack, /inspect failed/u)
  assert.equal(record.attributes.meta.error.stdout, '[]')
  assert.equal(record.attributes.meta.error.cause.message, 'podman failed')
  assert.equal(record.attributes.meta.error.cause.code, 'E_COMMAND')
  assert.equal(record.attributes.meta.error.cause.stderr, 'container not found')
  assert.equal(record.attributes.meta.circular.self, '[Circular]')
})

test('file provider validates required options', () => {
  assert.throws(
    () => createFileDiagnosticsProvider(),
    /file is required/u,
  )
  assert.throws(
    () => createFileDiagnosticsProvider({ file: 'diagnostics.ndjson', now: 1 }),
    /now must be a function/u,
  )
})
