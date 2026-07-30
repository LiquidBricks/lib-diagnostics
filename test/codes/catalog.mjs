import assert from 'node:assert/strict'
import test from 'node:test'

import { diagnostics } from '../../diagnostics.js'
import {
  PRECONDITION_INVALID,
  PRECONDITION_REQUIRED,
  TIMER_GENERIC_OPERATION,
  codes,
  definitions,
} from '../../codes/index.js'
import * as catalog from '../../codes/index.js'

const expectedCodes = [
  'NO_CODE',
  'UNKNOWN',
  'TIMER_GENERIC_OPERATION',
  'PRECONDITION_REQUIRED',
  'PRECONDITION_INVALID',
  'ROUTER_UNKNOWN_SUBJECT',
  'ROUTER_HANDLER_ERROR',
  'AGENT_REGISTRATION_FAILED',
  'AGENT_SOCKET_ERROR',
  'STREAM_CREATE_FAILED',
  'STREAM_SUBJECT_OVERLAP',
  'COMPONENT_INSTANCE_COMPLETION_PROJECTION_TIMEOUT',
  'DOMAIN_PROJECTOR_ROUTER_UNKNOWN_SUBJECT',
  'DOMAIN_PROJECTOR_ROUTER_HANDLER_ERROR',
  'DOMAIN_PROJECTOR_PRECONDITION_REQUIRED',
  'DOMAIN_SNAPSHOT_ROUTER_UNKNOWN_SUBJECT',
  'DOMAIN_SNAPSHOT_ROUTER_HANDLER_ERROR',
  'DOMAIN_SNAPSHOT_PRECONDITION_REQUIRED',
  'DOMAIN_SNAPSHOT_PRECONDITION_INVALID',
  'DOMAIN_SNAPSHOT_COMPONENT_STATE_NOT_FOUND',
  'DOMAIN_SNAPSHOT_COMPONENT_STATE_INVALID',
  'EVENTSTREAM_CONSUMER_ERROR',
  'EVENTSTREAM_CONSUMER_DELETE_ERROR',
  'CLIENT_LOG_WARN',
  'CLIENT_LOG_FATAL',
  'CLIENT_LOG_ERROR',
  'INVALID_OPERATION',
  'KVSTORE_MISSING',
  'LIMIT_INVALID',
  'HAS_INVALID_KEY',
  'HAS_INVALID_VALUE',
  'AND_INVALID_PREDICATE',
  'OR_INVALID_PREDICATE',
  'NOT_INVALID_PREDICATE',
  'FILTER_INVALID_PREDICATE',
  'TAIL_INVALID',
  'PROPERTY_INVALID_KEY',
  'PROPERTY_RESERVED_KEY',
  'PROPERTY_INVALID_VALUE',
  'EDGE_LABEL_REQUIRED',
  'EDGE_INCOMING_REQUIRED',
  'EDGE_OUTGOING_REQUIRED',
  'EDGE_INCOMING_MISSING',
  'EDGE_OUTGOING_MISSING',
  'VERTEX_LABEL_REQUIRED',
  'AS_INVALID_LABEL',
  'SELECT_INVALID_LABEL',
  'SELECT_LABEL_MISSING',
  'WHERE_INVALID_PREDICATE',
  'E_KV_PROVIDER_CONFIG_REQUIRED',
  'E_KV_PROVIDER_SERVERS_REQUIRED',
  'E_KV_PROVIDER_BUCKET_REQUIRED',
  'E_KV_PROVIDER_URL_REQUIRED',
  'E_KV_PROVIDER_PREFIX_REQUIRED',
].sort()

test('catalog exposes the exact canonical production inventory', () => {
  const namedCodes = Object.fromEntries(
    Object.entries(catalog).filter(([name]) => /^[A-Z][A-Z0-9_]*$/.test(name)),
  )

  assert.deepEqual(Object.keys(namedCodes).sort(), expectedCodes)
  assert.deepEqual(Object.keys(codes).sort(), expectedCodes)
  assert.deepEqual(Object.keys(definitions).sort(), expectedCodes)

  for (const code of expectedCodes) {
    assert.equal(namedCodes[code], code)
    assert.equal(codes[code], code)
    assert.equal(definitions[code].code, code)
    assert.match(definitions[code].category, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/)
    assert.ok(definitions[code].methods.length > 0)
    assert.ok(definitions[code].summary.length > 0)
  }
})

test('analysis indexes and their nested metadata are immutable and serializable', () => {
  assert.ok(Object.isFrozen(codes))
  assert.ok(Object.isFrozen(definitions))

  for (const definition of Object.values(definitions)) {
    assert.ok(Object.isFrozen(definition))
    assert.ok(Object.isFrozen(definition.methods))
  }

  assert.doesNotThrow(() => JSON.stringify({ codes, definitions }))
  assert.throws(() => {
    codes.PRECONDITION_REQUIRED = 'CHANGED'
  }, TypeError)
})

test('catalog codes pass through diagnostics and explicit timer emissions unchanged', () => {
  const entries = []
  const timingNames = []
  const logger = {
    error: (entry) => entries.push(entry),
    warn: (entry) => entries.push(entry),
    info: (entry) => entries.push(entry),
    debug: (entry) => entries.push(entry),
  }
  let now = 0
  const diag = diagnostics({
    logger,
    metrics: {
      count() {},
      timing: (name) => timingNames.push(name),
    },
    rateLimit: () => true,
    sample: () => true,
    now: () => ++now,
  })

  diag.warn(false, PRECONDITION_INVALID, 'invalid')
  assert.throws(
    () => diag.require(false, PRECONDITION_REQUIRED, 'required'),
    (error) => error.code === PRECONDITION_REQUIRED,
  )
  diag.timer('GENERIC_OPERATION', {}, { code: TIMER_GENERIC_OPERATION }).stop()

  assert.deepEqual(
    entries.map((entry) => entry.code),
    [PRECONDITION_INVALID, PRECONDITION_REQUIRED, TIMER_GENERIC_OPERATION],
  )
  assert.deepEqual(timingNames, ['GENERIC_OPERATION'])
})
