/** @fileoverview Validates arguments for various functions */

/** #### Validates a file path argument
 * Used by any3dModelToGlb()
 * @param {string} path  The file path to validate
 * @param {string} fnName  The name of the function being validated
 * @param {string} argName  The name of the argument being validated
 * @throws {RangeError}  If the argument is not a string
 */
const validatePath = (path, fnName, argName) => {
    const xpx = `${fnName}(): Invalid`; // exception prefix

    if (typeof path !== 'string') throw RangeError(
        `${xpx} ${argName} argument type '${typeof path}', should be 'string'`);
};

/** @fileoverview The main entry-point */


/** #### Converts various 3D model formats to GLB
 * 
 * @param {string} inputPath  Location of the input 3D model file
 * @param {string} outputPath  Location to write the output GLB file
 * @param {object} [options={}]  Configures the conversion
` * @returns  Promise which resolves when conversion is complete
 */
async function any3dModelToGlb(inputPath, outputPath, options = {}) {
    const xpx = 'any3dModelToGlb(): Invalid'; // exception prefix

    // Validate the input and output path arguments.
    validatePath(inputPath, 'any3dModelToGlb', 'inputPath');
    validatePath(outputPath, 'any3dModelToGlb', 'outputPath');

    // Validate `options` argument.
    if (typeof options !== 'object') throw RangeError(
        `${xpx} options type '${typeof options}', should be 'object', if present`);

    // Validate `options`, and fall back to defaults.
    const defaultedOptions = {
        noticeLevel: 2, // return all notices except debug, by default
        ...options,
    };
    const { noticeLevel } = defaultedOptions;
    if (typeof noticeLevel !== 'number') throw RangeError(
        `${xpx} options.noticeLevel type '${typeof noticeLevel}', should be 'number'`);
    if (!new Set([1,2,3,4]).has(noticeLevel)) throw RangeError(
        `${xpx} options.noticeLevel should be 1, 2, 3, or 4`);

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
