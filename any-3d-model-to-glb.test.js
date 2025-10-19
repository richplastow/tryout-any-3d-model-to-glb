import { deepStrictEqual as deep, rejects } from 'node:assert';
import { any3dModelToGlb as fn } from './any-3d-model-to-glb.js';

/**
 * @typedef {import('./any-3d-model-to-glb.js').ReadFile} ReadFile
 * @typedef {import('./any-3d-model-to-glb.js').WriteFile} WriteFile
 */

// Mocks reading a file, by returning dummy data and recording `path`.
const mockReadPaths = [];
/** @type {ReadFile} */
const mockReadFile = async (path) => {
    mockReadPaths.push(path);
    return 'mock file data';
}

// Mocks writing a file, by recording the most recent `path` and `data` values.
const mockWrittenFiles = [];
/** @type {WriteFile} */
const mockWriteFile = async (path, data) => {
    mockWrittenFiles.push({ path, data });
};

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
        await fn('input.obj', 'output.glb', {}, mockReadFile, mockWriteFile),
        { didSucceed: true, notices: [] },
        'Valid input and output paths, and default options'
    );

    deep(
        mockReadPaths,
        ['input.obj'],
        'Correct input path sent to readFile()'
    );

    deep(
        mockWrittenFiles.length,
        1,
        'One file written by mockWriteFile'
    );

    deep(
        mockWrittenFiles[0],
        { path: 'output.glb', data: '14 bytes' },
        'Correct output path and data sent to writeFile()'
    );

    console.log('OK: All any3dModelToGlb() tests passed!');
}
