import { deepStrictEqual as deep } from 'node:assert';
import { example01 as fn } from './example-01.js';

/**
 * @typedef {import('../../src/types.js').WriteFile} WriteFile
 */

// Mocks writing a file, by recording the most recent `path` and `data` values.
const mockWrittenFiles = [];
/** @type {WriteFile} */
const mockWriteFile = async (path, data) => {
    mockWrittenFiles.push({ path, data });
};

// Mocks performance.now() to keep tests deterministic.
let mockTime = 1000;
const mockTimer = () => {
    mockTime += 50.1; // increment by 50.1 ms each call
    return mockTime;
};

// Reads the real cube.obj file from disk, but only writes to mockWriteFile().
export const testExample01 = async () => {

    deep(
        await fn(mockWriteFile, mockTimer),
        {
            didSucceed: true,
            notices: [
                { code: 14481, message: 'Reading input file ./examples/01-cube-obj/cube.obj' },
                { code: 15118, message: 'Converting cube.obj' },
                { code: 27345, message: 'Converted model in 50.1 ms' },
                { code: 19158, message: 'Writing output file ./example-outputs/example-01-cube.glb' },
                { code: 26152, message: 'Wrote 1664 bytes' }
            ]
        },
        'Valid input and output paths, and real data'
    );

    deep(
        mockWrittenFiles.length,
        1,
        'One file written by mockWriteFile'
    );

    deep(
        mockWrittenFiles[0].path,
        './example-outputs/example-01-cube.glb',
        'Correct output path sent to writeFile()'
    );

    deep(
        mockWrittenFiles[0].data.byteLength,
        1664,
        'Correct output data byte length sent to writeFile()'
    );

    console.log('OK: All example01() tests passed!');
}
