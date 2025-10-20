/** @fileoverview The main entry-point */

import { convertModel } from "./src/convert-model.js";
import { validateOptionsObject, validateOptionsProps, validatePath } from "./src/validate-arg.js";

/**
 * @typedef {import('./src/validate-arg.js').OptionsArgument} OptionsArgument
 * @typedef {import('./src/validate-arg.js').DefaultedOptions} DefaultedOptions
 */

/**
 * @typedef {(path: string) => Promise<string>} ReadFile
 * @typedef {(path: string, data: string) => Promise<void>} WriteFile
 */

/** #### Converts various 3D model formats to GLB
 * 
 * @param {string} inputPath  Location of the input 3D model file
 * @param {string} outputPath  Location to write the output GLB file
 * @param {OptionsArgument} [options={}]  Configures the conversion
 * @param {ReadFile} [readFile] Optional async function to read a file - useful for testing/mocking
 * @param {WriteFile} [writeFile] Optional async function to write a file - useful for testing/mocking
 * @returns  Promise which resolves when conversion is complete
 */
export async function any3dModelToGlb(
    inputPath,
    outputPath,
    options = {},
    readFile = async (path) => {
        const fs = await import("node:fs/promises");
        return fs.readFile(path, "utf-8");
    },
    writeFile = async (
        path,
        data,
    ) => {
        const fs = await import("node:fs/promises");
        return fs.writeFile(path, data, "utf-8");
    },
) {
    const fn = 'any3dModelToGlb'; // function name

    // Validate the input and output path arguments, and the options object.
    validatePath(fn, 'inputPath', inputPath);
    validatePath(fn, 'outputPath', outputPath);
    validateOptionsObject(fn, options);
    // validateFunction(fn, 'readFile', readFile); // TODO
    // validateFunction(fn, 'writeFile', writeFile); // TODO

    // Fall back to default options, and validate option properties.
    /** @type {DefaultedOptions} */
    const defaultedOptions = {
        noticeLevel: 2, // return all notices except debug, by default
        ...options,
    };
    validateOptionsProps(fn, defaultedOptions);
    const { noticeLevel } = defaultedOptions;

    // Processing notices - error (4_), warning (3_), info (2_) and debug (1_).
    const notices = [];

    // Try to read the input file.
    notices.push({ code: 1_4481, message: `Reading input file ${inputPath}` });
    let inputData;
    try {
        inputData = await readFile(inputPath);
    } catch (error) {
        notices.push({
            code: 4_8172,
            detail: error.message,
            message: `Error reading file at ${inputPath}`,
        });
        return Promise.resolve({ didSucceed: false, notices });
    }

    // Get the filename from the input path, treating "/" and "\" the same.
    const filename = inputPath.split(/[/\\]/).pop() || inputPath;

    // Try to convert the model to GLB.
    notices.push({ code: 1_5118, message: `Converting ${filename}` });
    let outputData;
    try {
        outputData = await convertModel(filename, new Uint8Array(Buffer.from(inputData)));
    } catch (error) {
        notices.push({
            code: 4_9480,
            detail: error.message,
            message: `Error converting model ${inputPath} to GLB format`,
        });
        return Promise.resolve({ didSucceed: false, notices });
    }

    // Try to write to the output file.
    notices.push({ code: 1_9158, message: `Writing output file ${outputPath}` });
    try {
        await writeFile(outputPath, outputData);
    } catch (error) {
        notices.push({
            code: 4_1510,
            detail: error.message,
            message: `Error writing ${outputData.length} bytes to ${outputPath}`,
        });
        return Promise.resolve({ didSucceed: false, notices });
    }

    // Successful conversion.
    notices.push({ code: 2_6152, message: `Wrote ${outputData.length} bytes` });
    return Promise.resolve({
        didSucceed: true, // means there are no error-level notices
        notices
    });
}

// Run any3dModelToGlb() if this file was called directly by Node.js.
if (
    typeof process === 'object' && // is probably Node
    process.argv[1] && // has a 2nd item...
    process.argv[1][0] === '/' && // ...which starts "/"
    import.meta.url && // has a current filename...
    import.meta.url.slice(0, 8) === 'file:///' && // ...which starts "file:///"
    process.argv[1] === decodeURIComponent(import.meta.url).slice(7) // they match
) {
    // Get any command-line args.
    // TODO `-v` for verbose, `-vv` for very verbose, become noticeLevel 2 and 1
    const [ inputPath, outputPath ] = process.argv.slice(2);

    const { didSucceed, notices } = await any3dModelToGlb(inputPath, outputPath);
    if (didSucceed) {
        console.log('✅ Conversion succeeded');
    } else {
        console.error(
            '❌ Conversion failed:\n\n'
                + notices.map(n => `  ${n.code}: ${n.message}`).join('\n')
        );
        process.exit(1);
    }
}
