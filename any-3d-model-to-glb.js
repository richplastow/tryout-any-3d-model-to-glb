/** @fileoverview The main entry-point */

import { validateOptionsObject, validateOptionsProps, validatePath } from "./src/validate-arg.js";

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
export async function any3dModelToGlb(inputPath, outputPath, options = {}) {
    const fn = 'any3dModelToGlb'; // function name
    const xpx = fn + '(): Invalid'; // exception prefix

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
    const { noticeLevel } = defaultedOptions;

    // Processing notices - error (4_), warning (3_), info (2_) and debug (1_).
    const notices = [];

    // Implementation goes here
    // This is a placeholder function
    return Promise.resolve({
        didSucceed: true, // means there are no error-level notices
        notices
    });
}
