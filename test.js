import { testAny3dModelToGlb } from './any-3d-model-to-glb.test.js';
import { testExample01 } from './examples/01-cube-obj/example-01.test.js';
import { testExample02 } from './examples/02-teapot-dae/example-02.test.js';
import { testExample03 } from './examples/03-suzanne-gltf/example-03.test.js';
import { testExample04 } from './examples/04-bunny-stl/example-04.test.js';
import { testExample05 } from './examples/05-cow-fbx/example-05.test.js';
import { testValidateArg } from './src/validate-arg.test.js';

// Validation.
testValidateArg();

// End to end.
await testAny3dModelToGlb();

// Examples.
await testExample01();
await testExample02();
await testExample03();
await testExample04();
await testExample05();

console.log('✅ All tests passed!');
