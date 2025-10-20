import { testAny3dModelToGlb } from './any-3d-model-to-glb.test.js';
import { testExample01 } from './examples/01-cube-obj/example-01.test.js';
import { testValidateArg } from './src/validate-arg.test.js';

// Validation.
testValidateArg();

// End to end.
await testAny3dModelToGlb();

// Examples.
await testExample01();

console.log('✅ All tests passed!');
