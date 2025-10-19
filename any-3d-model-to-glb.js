/** @fileoverview The main entry-point */

import { validatePath } from "./src/validate-arg.js";

/** #### Converts various 3D model formats to GLB
 * 
 * @param {string} inputPath  Location of the input 3D model file
 * @param {string} outputPath  Location to write the output GLB file
 * @param {object} [options={}]  Configures the conversion
` * @returns  Promise which resolves when conversion is complete
 */
export async function any3dModelToGlb(inputPath, outputPath, options = {}) {
    const fn = 'any3dModelToGlb'; // function name
    const xpx = fn + '(): Invalid'; // exception prefix

    // Validate the input and output path arguments.
    validatePath(fn, 'inputPath', inputPath);
    validatePath(fn, 'outputPath', outputPath);

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
