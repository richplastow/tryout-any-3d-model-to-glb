/** @fileoverview The main entry-point */

import { VALID_INPUT_EXTENSIONS } from "./src/constants.js";
import { convertModel } from "./src/convert-model.js";
import { validateOptionsObject, validateOptionsProps, validatePath } from "./src/validate-arg.js";

/**
 * @typedef {import('./src/validate-arg.js').OptionsArgument} OptionsArgument
 * @typedef {import('./src/validate-arg.js').DefaultedOptions} DefaultedOptions
 * @typedef {import('./src/types.js').ReadFile} ReadFile
 * @typedef {import('./src/types.js').WriteFile} WriteFile
 */

/** #### Converts various 3D model formats to GLB
 * 
 * @param {string} inputPath  Location of the input 3D model file
 * @param {string} outputPath  Location to write the output GLB file
 * @param {OptionsArgument} [options={}]  Configures the conversion
 * @param {ReadFile} [readFile] Optional async function to read a file - useful for browsers, and testing
 * @param {WriteFile} [writeFile] Optional async function to write a file - useful for browsers, and testing
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
        noticeLevel: 3, // return only warnings and errors, by default
        ...options,
    };
    validateOptionsProps(fn, defaultedOptions);
    const { noticeLevel } = defaultedOptions;

    // Processing notices - error (4_), warning (3_), info (2_) and debug (1_).
    const notices = [];

    // Try to read the input file.
    if (noticeLevel <= 1)
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
    if (noticeLevel <= 1)
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
    if (noticeLevel <= 1)
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
    if (noticeLevel <= 2)
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
    const args = process.argv.slice(2);
    const [ inputPath, outputPath, flags ] = args;

    switch (true) {
        case argsContainHelpFlag(args):
            console.log(cliUsage());
            process.exit(0);
        case argsContainVersionFlag(args):
            console.log('any-3d-model-to-glb version 0.0.1'); // TODO sync with package.json
            process.exit(0);
        case !inputPath: // undefined or empty string
            console.error(`❌ Missing inputPath argument\n\n${cliUsage()}`);
            process.exit(1);
        case !outputPath:
            console.error(`❌ Missing outputPath argument\n\n${cliUsage()}`);
            process.exit(1);
    }

    let noticeLevel; // default to warnings and errors
    switch (flags) {
        case '-n1':
            noticeLevel = 1; // everything, including debug
            break;
        case '-n2':
            noticeLevel = 2; // info, warnings and errors
            break;
        case '-n3':
            noticeLevel = 3; // warnings and errors
            break;
        case '-n4':
            noticeLevel = 4; // errors only
            break;
    }

    // Run the conversion and render `notices` as a string.
    const { didSucceed, notices } = await any3dModelToGlb(
        inputPath,
        outputPath,
        noticeLevel ? { noticeLevel } : {},
    );
    const noticesToDisplay = notices.map(n => {
        const c = n.code.toString();
        return `\n  ${c[0]}_${c.slice(1)}: ${n.message}`
    }).join('');

    if (didSucceed) {
        console.log(`✅ Conversion succeeded${noticesToDisplay}`);
        process.exit(0);
    } else {
        console.error(`❌ Conversion failed:${noticesToDisplay}`);
        process.exit(1);
    }
}

function cliUsage() {
    const name = 'any-3d-model-to-glb';
    const before = '-'.repeat( Math.ceil((80 - name.length - 2) / 2) );
    const after = '-'.repeat( Math.floor((80 - name.length - 2) / 2) );
    return [
        `${before} ${name} ${after}`,
        '',
        'Converts various 3D model formats to GLB format.',
        '',
        'Usage: node any3d-model-to-glb.js <inputPath> <outputPath> [options]',
        '',
        '...or call the any3dModelToGlb() function from Node.js or browser code.',
        '',
        'Supported input formats:',
        `  ${Array.from(VALID_INPUT_EXTENSIONS).sort().join(', ')}`,
        '',
        'node any3d-model-to-glb.js -h or --help     shows this help message.',
        'node any3d-model-to-glb.js -v or --version  shows the current version.',
        'node any3d-model-to-glb.js <in> <out> -n1   debug mode',
        'node any3d-model-to-glb.js <in> <out> -n2   show info',
        'node any3d-model-to-glb.js <in> <out> -n3   show warnings and errors (default)',
        'node any3d-model-to-glb.js <in> <out> -n4   show errors only',
        '',
        '='.repeat(80),
    ].join('\n');
}

function argsContainHelpFlag(args) {
    return args.includes('-h') || args.includes('--help');
}

function argsContainVersionFlag(args) {
    return args.includes('-v') || args.includes('--version');
}
