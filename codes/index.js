import { createCatalog } from './_catalog.js'

const catalog = createCatalog()

// Diagnostics infrastructure
export const NO_CODE = catalog.define('NO_CODE', {
  category: 'internal',
  methods: ['rateLimit'],
  summary: 'Rate-limit bucket used for diagnostics without an explicit code.',
})
export const UNKNOWN = catalog.define('UNKNOWN', {
  category: 'internal',
  methods: ['warn'],
  summary: 'Fallback warning code when a diagnostics proxy receives no code.',
})
export const TIMER_GENERIC_OPERATION = catalog.define('TIMER_GENERIC_OPERATION', {
  category: 'timer',
  methods: ['timer'],
  summary: 'A generic diagnostics operation timer completed.',
})

// Shared validation and routing
export const PRECONDITION_REQUIRED = catalog.define('PRECONDITION_REQUIRED', {
  category: 'precondition',
  methods: ['require'],
  summary: 'A required precondition value was absent.',
})
export const PRECONDITION_INVALID = catalog.define('PRECONDITION_INVALID', {
  category: 'precondition',
  methods: ['invariant', 'require', 'warn'],
  summary: 'A supplied precondition value was invalid.',
})
export const ROUTER_UNKNOWN_SUBJECT = catalog.define('ROUTER_UNKNOWN_SUBJECT', {
  category: 'router',
  methods: ['invariant'],
  summary: 'A router received a subject for which no handler exists.',
})
export const ROUTER_HANDLER_ERROR = catalog.define('ROUTER_HANDLER_ERROR', {
  category: 'router',
  methods: ['error'],
  summary: 'A router handler failed unexpectedly.',
})

// Component agents
export const AGENT_REGISTRATION_FAILED = catalog.define('AGENT_REGISTRATION_FAILED', {
  category: 'agent',
  methods: ['warn'],
  summary: 'A component agent failed to register its components.',
})
export const AGENT_SOCKET_ERROR = catalog.define('AGENT_SOCKET_ERROR', {
  category: 'agent',
  methods: ['warn'],
  summary: 'A component agent socket or queued socket operation failed.',
})

// Backend stream management
export const STREAM_CREATE_FAILED = catalog.define('STREAM_CREATE_FAILED', {
  category: 'stream',
  methods: ['error'],
  summary: 'A JetStream stream could not be created or updated.',
})
export const STREAM_SUBJECT_OVERLAP = catalog.define('STREAM_SUBJECT_OVERLAP', {
  category: 'stream',
  methods: ['error'],
  summary: 'A stream configuration overlaps subjects owned by another stream.',
})

// Component orchestration
export const COMPONENT_INSTANCE_COMPLETION_PROJECTION_TIMEOUT = catalog.define(
  'COMPONENT_INSTANCE_COMPLETION_PROJECTION_TIMEOUT',
  {
    category: 'component-instance',
    methods: ['require'],
    summary: 'A component instance completion trigger projection did not appear before its deadline.',
  },
)

// Domain projector
export const DOMAIN_PROJECTOR_ROUTER_UNKNOWN_SUBJECT = catalog.define(
  'DOMAIN_PROJECTOR_ROUTER_UNKNOWN_SUBJECT',
  {
    category: 'domain-projector',
    methods: ['invariant'],
    summary: 'The domain projector received a subject for which no handler exists.',
  },
)
export const DOMAIN_PROJECTOR_ROUTER_HANDLER_ERROR = catalog.define(
  'DOMAIN_PROJECTOR_ROUTER_HANDLER_ERROR',
  {
    category: 'domain-projector',
    methods: ['error'],
    summary: 'A domain projector router handler failed unexpectedly.',
  },
)
export const DOMAIN_PROJECTOR_PRECONDITION_REQUIRED = catalog.define(
  'DOMAIN_PROJECTOR_PRECONDITION_REQUIRED',
  {
    category: 'domain-projector',
    methods: ['require'],
    summary: 'A value required by a domain projection was absent.',
  },
)

// Domain snapshot
export const DOMAIN_SNAPSHOT_ROUTER_UNKNOWN_SUBJECT = catalog.define(
  'DOMAIN_SNAPSHOT_ROUTER_UNKNOWN_SUBJECT',
  {
    category: 'domain-snapshot',
    methods: ['invariant'],
    summary: 'The domain snapshot service received a subject for which no handler exists.',
  },
)
export const DOMAIN_SNAPSHOT_ROUTER_HANDLER_ERROR = catalog.define(
  'DOMAIN_SNAPSHOT_ROUTER_HANDLER_ERROR',
  {
    category: 'domain-snapshot',
    methods: ['error'],
    summary: 'A domain snapshot router handler failed unexpectedly.',
  },
)
export const DOMAIN_SNAPSHOT_PRECONDITION_REQUIRED = catalog.define(
  'DOMAIN_SNAPSHOT_PRECONDITION_REQUIRED',
  {
    category: 'domain-snapshot',
    methods: ['require'],
    summary: 'A value required by a domain snapshot operation was absent.',
  },
)
export const DOMAIN_SNAPSHOT_PRECONDITION_INVALID = catalog.define(
  'DOMAIN_SNAPSHOT_PRECONDITION_INVALID',
  {
    category: 'domain-snapshot',
    methods: ['require'],
    summary: 'A value supplied to a domain snapshot operation was invalid.',
  },
)
export const DOMAIN_SNAPSHOT_COMPONENT_STATE_NOT_FOUND = catalog.define(
  'DOMAIN_SNAPSHOT_COMPONENT_STATE_NOT_FOUND',
  {
    category: 'domain-snapshot',
    methods: ['require'],
    summary: 'A component state required by a domain snapshot operation was not found.',
  },
)
export const DOMAIN_SNAPSHOT_COMPONENT_STATE_INVALID = catalog.define(
  'DOMAIN_SNAPSHOT_COMPONENT_STATE_INVALID',
  {
    category: 'domain-snapshot',
    methods: ['require'],
    summary: 'A component state used by a domain snapshot operation was invalid.',
  },
)

// Eventstream
export const EVENTSTREAM_CONSUMER_ERROR = catalog.define('EVENTSTREAM_CONSUMER_ERROR', {
  category: 'eventstream',
  methods: ['warn'],
  summary: 'An eventstream consumer failed while processing messages.',
})
export const EVENTSTREAM_CONSUMER_DELETE_ERROR = catalog.define(
  'EVENTSTREAM_CONSUMER_DELETE_ERROR',
  {
    category: 'eventstream',
    methods: ['warn'],
    summary: 'An eventstream consumer could not be deleted during cleanup.',
  },
)

// Client-originated logs
export const CLIENT_LOG_WARN = catalog.define('CLIENT_LOG_WARN', {
  category: 'client-log',
  methods: ['warn'],
  summary: 'A client submitted a warning-level log.',
})
export const CLIENT_LOG_FATAL = catalog.define('CLIENT_LOG_FATAL', {
  category: 'client-log',
  methods: ['warn'],
  summary: 'A client submitted a fatal-level log.',
})
export const CLIENT_LOG_ERROR = catalog.define('CLIENT_LOG_ERROR', {
  category: 'client-log',
  methods: ['warn'],
  summary: 'A client submitted an error-level log.',
})

// Graph traversal and mutation
export const INVALID_OPERATION = catalog.define('INVALID_OPERATION', {
  category: 'graph',
  methods: ['invariant', 'require'],
  summary: 'A graph traversal contains an invalid operation.',
})
export const KVSTORE_MISSING = catalog.define('KVSTORE_MISSING', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph operation requires a key-value store that is unavailable.',
})
export const LIMIT_INVALID = catalog.define('LIMIT_INVALID', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph limit step received an invalid limit.',
})
export const HAS_INVALID_KEY = catalog.define('HAS_INVALID_KEY', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph has step received an invalid property key.',
})
export const HAS_INVALID_VALUE = catalog.define('HAS_INVALID_VALUE', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph has step received an invalid comparison value.',
})
export const AND_INVALID_PREDICATE = catalog.define('AND_INVALID_PREDICATE', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph and step received an invalid predicate.',
})
export const OR_INVALID_PREDICATE = catalog.define('OR_INVALID_PREDICATE', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph or step received an invalid predicate.',
})
export const NOT_INVALID_PREDICATE = catalog.define('NOT_INVALID_PREDICATE', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph not step received an invalid predicate.',
})
export const FILTER_INVALID_PREDICATE = catalog.define('FILTER_INVALID_PREDICATE', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph filter step received an invalid predicate.',
})
export const TAIL_INVALID = catalog.define('TAIL_INVALID', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph tail step received an invalid count.',
})
export const PROPERTY_INVALID_KEY = catalog.define('PROPERTY_INVALID_KEY', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph property mutation received an invalid key.',
})
export const PROPERTY_RESERVED_KEY = catalog.define('PROPERTY_RESERVED_KEY', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph property mutation attempted to use a reserved key.',
})
export const PROPERTY_INVALID_VALUE = catalog.define('PROPERTY_INVALID_VALUE', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph property mutation received an invalid value.',
})
export const EDGE_LABEL_REQUIRED = catalog.define('EDGE_LABEL_REQUIRED', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph edge operation requires a label.',
})
export const EDGE_INCOMING_REQUIRED = catalog.define('EDGE_INCOMING_REQUIRED', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph edge operation requires an incoming vertex identifier.',
})
export const EDGE_OUTGOING_REQUIRED = catalog.define('EDGE_OUTGOING_REQUIRED', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph edge operation requires an outgoing vertex identifier.',
})
export const EDGE_INCOMING_MISSING = catalog.define('EDGE_INCOMING_MISSING', {
  category: 'graph',
  methods: ['require'],
  summary: 'The incoming vertex for a graph edge does not exist.',
})
export const EDGE_OUTGOING_MISSING = catalog.define('EDGE_OUTGOING_MISSING', {
  category: 'graph',
  methods: ['require'],
  summary: 'The outgoing vertex for a graph edge does not exist.',
})
export const VERTEX_LABEL_REQUIRED = catalog.define('VERTEX_LABEL_REQUIRED', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph vertex operation requires a label.',
})
export const AS_INVALID_LABEL = catalog.define('AS_INVALID_LABEL', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph as step received an invalid label.',
})
export const SELECT_INVALID_LABEL = catalog.define('SELECT_INVALID_LABEL', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph select step received an invalid label.',
})
export const SELECT_LABEL_MISSING = catalog.define('SELECT_LABEL_MISSING', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph select step referenced a label that was not bound.',
})
export const WHERE_INVALID_PREDICATE = catalog.define('WHERE_INVALID_PREDICATE', {
  category: 'graph',
  methods: ['require'],
  summary: 'A graph where step received an invalid predicate.',
})

// Graph key-value providers
export const E_KV_PROVIDER_CONFIG_REQUIRED = catalog.define('E_KV_PROVIDER_CONFIG_REQUIRED', {
  category: 'kv-provider',
  methods: ['require'],
  summary: 'A graph key-value provider requires a configuration object.',
})
export const E_KV_PROVIDER_SERVERS_REQUIRED = catalog.define('E_KV_PROVIDER_SERVERS_REQUIRED', {
  category: 'kv-provider',
  methods: ['require'],
  summary: 'The NATS key-value provider requires a server address.',
})
export const E_KV_PROVIDER_BUCKET_REQUIRED = catalog.define('E_KV_PROVIDER_BUCKET_REQUIRED', {
  category: 'kv-provider',
  methods: ['require'],
  summary: 'The NATS key-value provider requires a bucket name.',
})
export const E_KV_PROVIDER_URL_REQUIRED = catalog.define('E_KV_PROVIDER_URL_REQUIRED', {
  category: 'kv-provider',
  methods: ['require'],
  summary: 'The Redis key-value provider requires a connection URL.',
})
export const E_KV_PROVIDER_PREFIX_REQUIRED = catalog.define('E_KV_PROVIDER_PREFIX_REQUIRED', {
  category: 'kv-provider',
  methods: ['require'],
  summary: 'The Redis key-value provider requires a key prefix.',
})

export const { codes, definitions } = catalog.finalize()
