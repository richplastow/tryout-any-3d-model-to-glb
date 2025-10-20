/** @fileoverview Constants used throughout the app */

const VALID_INPUT_EXTENSIONS = new Set([
    'dae',
    'fbx',
    'glb',
    'gltf',
    'obj',
    'stl',
    // TODO NEXT refine this list
]);

/** @fileoverview Converts a 3D model to GBL format */


/** #### Converts 3D model content to GLB format
 * 
 * If you want to pass a string to this function, you will need to convert it to
 * a Uint8Array first, for example:
 * 
 * ```js
 * const modelBytes = new TextEncoder().encode(`
 *   # Minimal cube
 *   v -0.5 -0.5 -0.5
 *   v -0.5 -0.5  0.5
 *   v -0.5  0.5 -0.5
 *   v -0.5  0.5  0.5
 *   v  0.5 -0.5 -0.5
 *   v  0.5 -0.5  0.5
 *   v  0.5  0.5 -0.5
 *   v  0.5  0.5  0.5
 *   f 1 2 4 3
 *   f 5 7 8 6
 *   f 1 5 6 2
 *   f 3 4 8 7
 *   f 1 3 7 5
 *   f 2 6 8 4
 * `);
 * ```
 * 
 * @param {any} assimp  An initialised AssimpJS instance
 * @param {string} filename  The name of the model file
 * @param {Uint8Array} modelBytes  The raw file content to convert
 * @throws {Error}  If conversion fails
 */
const convertModel = async (assimp, filename, modelBytes) => {
    const xpx = 'convertModel(): Invalid'; // exception prefix

    // Check that filename is a valid string, and modelBytes is a Uint8Array.
    // TODO NEXT move to validate-arg.js and write unit tests
    if (typeof filename !== 'string' || filename.length === 0) throw new TypeError(
        `${xpx} filename argument type '${typeof filename}', should be non-empty 'string'`);
    if (filename.includes('/') || filename.includes('\\')) throw new RangeError(
        `${xpx} filename argument '${filename}' should not include path separators "/" or "\\"`);
    const ext = filename.match(/\.([a-z0-9]{1,9})$/);
    if (!ext) throw RangeError(
        `${xpx} filename argument has no valid file extension`);
    if (!VALID_INPUT_EXTENSIONS.has(ext[1])) throw RangeError(
        `${xpx} filename argument extension '.${ext[1]}' is not a supported 3D model format`);
    if (!(modelBytes instanceof Uint8Array)) throw new TypeError(
        `${xpx} modelBytes argument type '${typeof modelBytes}', should be 'Uint8Array'`);

    // Create a new AssimpJS file-list object.
    let fileList = new assimp.FileList();
    
    fileList.AddFile(filename, modelBytes);

    // Convert file list to GLB version 2.
    // Other formats are "assjson", "gltf", "gltf2" and (version 1) "glb".
    let result = assimp.ConvertFileList(fileList, 'glb2');

    // Check if the conversion succeeded.
    if (!result.IsSuccess() || result.FileCount() == 0) {
        throw new Error(`Conversion failed, error code: ${result.GetErrorCode()}`);
    }

    // Return the converted GLB.
    return result.GetFile(0).GetContent();
};

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
        if (!VALID_INPUT_EXTENSIONS.has(ext[1])) throw RangeError(
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
 * @typedef {import('./src/types.js').ReadFile} ReadFile
 * @typedef {import('./src/types.js').WriteFile} WriteFile
 * @typedef {import('./src/types.js').Timer} Timer
 */

// Initialize AssimpJS. In Node the 'assimpjs' library is loaded here, but in
// the browser `<script type="text/javascript" src="assimpjs.js"></script>`
// has already loaded it into global (window) scope.
const isNode = typeof process === 'object' && typeof window === 'undefined';
const initAssimpjs = async () => {
    const assimpjsModule = await import('assimpjs');
    return assimpjsModule.default();
};
// @ts-expect-error
const assimp = isNode ? await initAssimpjs() : await window.assimpjs();

/** #### Converts various 3D model formats to GLB
 * 
 * @param {string} inputPath  Location of the input 3D model file
 * @param {string} outputPath  Location to write the output GLB file
 * @param {OptionsArgument} [options={}]  Configures the conversion
 * @param {ReadFile} [readFile] Optional async function to read a file - useful for browsers, and testing
 * @param {WriteFile} [writeFile] Optional async function to write a file - useful for browsers, and testing
 * @param {Timer} [timer]  Optional function returning current time in milliseconds - useful for testing
 * @returns  Promise which resolves when conversion is complete
 */
async function any3dModelToGlb(
    inputPath,
    outputPath,
    options = {},
    readFile = async (path) => {
        const fs = await import('node:fs/promises');
        return fs.readFile(path);
    },
    writeFile = async (
        path,
        data,
    ) => {
        const fs = await import('node:fs/promises');
        return fs.writeFile(path, data);
    },
    timer = performance.now.bind(performance),
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
    const timeBefore = timer();
    try {
        outputData = await convertModel(
            assimp,
            filename,
            new Uint8Array(inputData)
        );
    } catch (error) {
        notices.push({
            code: 4_9480,
            detail: error.message,
            message: `Error converting model ${inputPath} to GLB format`,
        });
        return Promise.resolve({ didSucceed: false, notices });
    }
    const timeAfter = timer();
    if (noticeLevel <= 2) {
        const timeMs = (timeAfter - timeBefore).toFixed(1);
        notices.push({
            code: 2_7345,
            message: `Converted model in ${timeMs} ms`,
        });
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

export { any3dModelToGlb };
