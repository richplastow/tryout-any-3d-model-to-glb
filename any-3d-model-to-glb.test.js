import { deepStrictEqual as deep, rejects } from 'node:assert';
import { any3dModelToGlb as fn } from './any-3d-model-to-glb.js';

/**
 * @typedef {import('./src/types.js').ReadFile} ReadFile
 * @typedef {import('./src/types.js').WriteFile} WriteFile
 */

// Mocks reading a file, by returning dummy data and recording `path`.
const mockReadPaths = [];
/** @type {ReadFile} */
const mockReadFile = async (path) => {
    mockReadPaths.push(path);
    return `
        # Minimal cube
        v -0.5 -0.5 -0.5
        v -0.5 -0.5  0.5
        v -0.5  0.5 -0.5
        v -0.5  0.5  0.5
        v  0.5 -0.5 -0.5
        v  0.5 -0.5  0.5
        v  0.5  0.5 -0.5
        v  0.5  0.5  0.5
        f 1 2 4 3
        f 5 7 8 6
        f 1 5 6 2
        f 3 4 8 7
        f 1 3 7 5
        f 2 6 8 4
    `;
};

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
        await fn('input.obj', 'output.glb', { noticeLevel: 1 }, mockReadFile, mockWriteFile),
        {
            didSucceed: true,
            notices: [
                { code: 14481, message: 'Reading input file input.obj' },
                { code: 15118, message: 'Converting input.obj' },
                { code: 19158, message: 'Writing output file output.glb' },
                { code: 26152, message: 'Wrote 228 bytes' }
            ]
        },
        'Valid input and output paths, real data, and default options'
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
        mockWrittenFiles[0].path,
        'output.glb',
        'Correct output path sent to writeFile()'
    );

    deep(
        mockWrittenFiles[0].data.byteLength,
        228,
        'Correct output data byte length sent to writeFile()'
    );

    console.log('OK: All any3dModelToGlb() tests passed!');
}
