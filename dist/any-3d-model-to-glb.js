/** @fileoverview Validates arguments for various functions */

/**
 * @typedef {{
 *   noticeLevel?: number,
 * }} OptionsArgument
 * 
 * @typedef {Required<OptionsArgument>} DefaultedOptions
 */

/** #### Validates a file path argument
 * Used by any3dModelToGlb()
 * @param {string} fnName  The name of the function being validated
 * @param {'inputPath'|'outputPath'} argName  The name of the argument being validated
 * @param {string} path  The file path to validate
 * @throws {RangeError}  If the argument is not a string
 */
const validatePath = (fnName, argName, path) => {
    const xpx = `${fnName}(): Invalid`; // exception prefix

    // Should be a string, non-empty, max length 1000.
    if (typeof path !== 'string') throw RangeError(
        `${xpx} ${argName} argument type '${typeof path}', should be 'string'`);
    if (path.length === 0) throw RangeError(
        `${xpx} ${argName} argument is an empty string, should be a valid file path`);
    if (path.length > 1000) throw RangeError(
        `${xpx} ${argName} argument length ${path.length} exceeds maximum of 1000 characters`);

    // Check for invalid exFAT characters (also invalid on most file systems)
    // exFAT disallows: < > : " / \ | ? *
    // Also disallow control characters U+0000 through U+001F
    const invalidChars = /[<>:"|?*\x00-\x1F]/;
    if (invalidChars.test(path)) throw RangeError(
        `${xpx} ${argName} argument '${path}' contains invalid characters for file paths`);

    const ext = path.match(/\.([a-z0-9]{1,9})$/);
    if (!ext) throw RangeError(
        `${xpx} ${argName} argument has no valid file extension`);
    if (argName === 'outputPath' && ext[1] !== 'glb') throw RangeError(
        `${xpx} ${argName} argument extension '.${ext[1]}' is not supported, should be '.glb'`);
    if (argName === 'inputPath') {
        const validInputExtensions = new Set([
            '3mf', '3mfz', 'fbx', 'gltf', 'glb', 'obj', 'ply', 'stl', 'wrl', 'wrz', // TODO refine this list
        ]);
        if (!validInputExtensions.has(ext[1])) throw RangeError(
            `${xpx} ${argName} argument extension '.${ext[1]}' is not a supported 3D model format`);
    }
};

/** #### Validate the any3dModelToGlb() options argument
 * Just the object itself, not its properties
 * @param {string} fnName  The name of the function being validated
 * @param {OptionsArgument} options  The options argument object, before defaults
 * @throws {RangeError}  If the options argument is invalid
 */
const validateOptionsObject = (fnName, options) => {
    const xpx = `${fnName}(): Invalid`; // exception prefix

    if (options === null) throw RangeError(
        `${xpx} options argument is null, should be a plain object`);
    if (Array.isArray(options)) throw RangeError(
        `${xpx} options argument is an array, should be a plain object`);
    if (typeof options !== 'object') throw RangeError(
        `${xpx} options argument type '${typeof options}', should be 'object'`);
};

/** #### Validate the any3dModelToGlb() options argument properties
 * @param {string} fnName  The name of the function being validated
 * @param {DefaultedOptions} defaultedOptions  The options argument object, after defaults
 * @throws {RangeError}  If any option property is invalid
 */
const validateOptionsProps = (fnName, defaultedOptions) => {
    const xpx = `${fnName}():`; // exception prefix

    // Only accept known option names.
    const validOptionNames = new Set([
        'noticeLevel',
    ]);
    for (const propName of Object.keys(defaultedOptions)) {
        if (!validOptionNames.has(propName)) throw RangeError(
            `${xpx} options.${propName} is not a recognised option name`);
    }

    // Destructure options for validation.
    const { noticeLevel } = defaultedOptions;

    // Validate the `noticeLevel` option.
    if (typeof noticeLevel !== 'number') throw RangeError(
        `${xpx} Invalid options.noticeLevel type '${typeof noticeLevel}', should be 'number'`);
    if (!new Set([1,2,3,4]).has(noticeLevel)) throw RangeError(
        `${xpx} Invalid options.noticeLevel should be 1, 2, 3, or 4`);
};

/** @fileoverview The main entry-point */


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
async function any3dModelToGlb(
    inputPath,
    outputPath,
    options = {},
    readFile = async (path) => {
        const fs = await import('node:fs/promises');
        return fs.readFile(path, "utf-8");
    },
    writeFile = async (
        path,
        data,
    ) => {
        const fs = await import('node:fs/promises');
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

    // Processing notices - error (4_), warning (3_), info (2_) and debug (1_).
    const notices = [];

    // Try to read the input file.
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

    // TODO implementation goes here
    const outputData = `${inputData.length} bytes`;

    // Try to read the input file.
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

export { any3dModelToGlb };
