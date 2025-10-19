import { deepStrictEqual as deep, rejects } from 'node:assert';
import { any3dModelToGlb as fn } from './any-3d-model-to-glb.js';

export const testAny3dModelToGlb = async () => {
    const xpx = 'any3dModelToGlb(): '; // exception prefix


    // INVALID ARGUMENTS

    await rejects(
        // @ts-expect-error
        () => fn(/**@type {string}*/(/**@type {unknown}*/ (123))),
        new RangeError(xpx + "Invalid inputPath argument type 'number', should be 'string'"),
        'Invalid `inputPath` argument type'
    );

    await rejects(
        () => fn('input.obj', /**@type {string}*/(/**@type {unknown}*/ (true))),
        new RangeError(xpx + "Invalid outputPath argument type 'boolean', should be 'string'"),
        'Invalid `outputPath` argument type'
    );


    // SUCCESS

    deep(
        await fn('input.obj', 'output.glb'),
        { didSucceed: true, notices: [] },
        'Valid input and output paths, and default options'
    );

    console.log('OK: All any3dModelToGlb() tests passed!');
}
