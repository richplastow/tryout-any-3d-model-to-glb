import { deepStrictEqual as deep } from 'node:assert';
import { example05 as fn } from './example-05.js';

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

// Reads the real cow.fbx file from disk, but only writes to mockWriteFile().
export const testExample05 = async () => {

    deep(
        await fn(mockWriteFile, mockTimer),
        {
            didSucceed: true,
            notices: [
                { code: 14481, message: 'Reading input file ./examples/05-cow-fbx/cow.fbx' },
                { code: 15118, message: 'Converting cow.fbx' },
                { code: 27345, message: 'Converted model in 50.1 ms' },
                { code: 19158, message: 'Writing output file ./example-outputs/example-05-cow.glb' },
                { code: 26152, message: 'Wrote 279720 bytes' }
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
        './example-outputs/example-05-cow.glb',
        'Correct output path sent to writeFile()'
    );

    deep(
        mockWrittenFiles[0].data.byteLength,
        279720,
        'Correct output data byte length sent to writeFile()'
    );

    console.log('OK: All example05() tests passed!');
}
