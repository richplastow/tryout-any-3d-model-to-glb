# tryout-any-3d-model-to-glb

**Node.js utility to convert various 3D model formats to GLB**

- Version: 0.0.1
- Created: 2025-10-18 by Rich Plastow
- Updated: 2025-10-18 by Rich Plastow
- License: MIT
- Repo: <https://github.com/richplastow/tryout-any-3d-model-to-glb>

## Examples

1. `node examples/run-01.js` TODO
2. `node examples/run-02.js` TODO
3. `node examples/run-03.js` TODO
4. `node examples/run-04.js` TODO

## Install and build

```bash
npm install --global rollup
# added 4 packages, and audited 5 packages in 1s
rollup --version
# rollup v4.52.5
npm install
# (only installs the "@types/node" dev-dependency, ~3 MB for ~150 items)
npm run build
# any-3d-model-to-glb.js → dist/any-3d-model-to-glb.js...
# created dist/any-3d-model-to-glb.js in 32ms
# ✅ Build succeeded!
```

## Check types

```bash
npm install --global typescript
# added 1 package in 709ms
tsc --version
# Version 5.9.3
npm check-types
# ✅ No type-errors found!
```

## Unit tests

```bash
npm test
# ...
# OK: All any3dModelToGlb() tests passed!
# ✅ All tests passed!
```

## Preflight, before each commit

```bash
npm run ok
# ...runs tests, checks types, and rebuilds the dist/ file
# ...
# ✅ Build succeeded!
```
