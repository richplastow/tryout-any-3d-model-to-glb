import { testAny3dModelToGlb } from './any-3d-model-to-glb.test.js';
import { testValidateArg } from './src/validate-arg.test.js';

// Validation.
testValidateArg();

// End to end.
await testAny3dModelToGlb();

console.log('✅ All tests passed!');
