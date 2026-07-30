import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const packageRoot = new URL('../', import.meta.url)
const packageJson = JSON.parse(
  fs.readFileSync(new URL('package.json', packageRoot), 'utf8'),
)

const expectedExportKeys = [
  '.',
  './diagnostics',
  './codes',
  './loggers/console',
  './loggers/nats',
  './metrics/console',
  './metrics/nats',
]

test('package exports expose the documented diagnostics surface', () => {
  assert.deepEqual(
    Object.keys(packageJson.exports).sort(),
    expectedExportKeys.sort(),
  )
})

test('every package export resolves to its declared module', async () => {
  await Promise.all(expectedExportKeys.map(async (subpath) => {
    const target = packageJson.exports[subpath]
    const targetUrl = new URL(target, packageRoot)
    const packageSpecifier = packageJson.name + subpath.slice(1)

    assert.ok(fs.existsSync(targetUrl), `missing export target: ${target}`)

    const [fromPackage, fromFile] = await Promise.all([
      import(packageSpecifier),
      import(targetUrl.href),
    ])
    assert.strictEqual(fromPackage, fromFile)
  }))
})
