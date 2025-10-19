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
 * @param {string} argName  The name of the argument being validated
 * @param {string} path  The file path to validate
 * @throws {RangeError}  If the argument is not a string
 */
const validatePath = (fnName, argName, path) => {
    const xpx = `${fnName}(): Invalid`; // exception prefix

    if (typeof path !== 'string') throw RangeError(
        `${xpx} ${argName} argument type '${typeof path}', should be 'string'`);
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

/** #### Converts various 3D model formats to GLB
 * 
 * @param {string} inputPath  Location of the input 3D model file
 * @param {string} outputPath  Location to write the output GLB file
 * @param {OptionsArgument} [options={}]  Configures the conversion
 * @returns  Promise which resolves when conversion is complete
 */
async function any3dModelToGlb(inputPath, outputPath, options = {}) {
    const fn = 'any3dModelToGlb'; // function name

    // Validate the input and output path arguments, and the options object.
    validatePath(fn, 'inputPath', inputPath);
    validatePath(fn, 'outputPath', outputPath);
    validateOptionsObject(fn, options);

    // Fall back to default options, and validate option properties.
    /** @type DefaultedOptions */
    const defaultedOptions = {
        noticeLevel: 2, // return all notices except debug, by default
        ...options,
    };
    validateOptionsProps(fn, defaultedOptions);

    // Processing notices - error (4_), warning (3_), info (2_) and debug (1_).
    const notices = [];

    // Implementation goes here
    // This is a placeholder function
    return Promise.resolve({
        didSucceed: true, // means there are no error-level notices
        notices
    });
}

export { any3dModelToGlb };
