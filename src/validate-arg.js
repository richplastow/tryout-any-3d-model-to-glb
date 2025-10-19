/** @fileoverview Validates arguments for various functions */

/** #### Validates a file path argument
 * Used by any3dModelToGlb()
 * @param {string} fnName  The name of the function being validated
 * @param {string} argName  The name of the argument being validated
 * @param {string} path  The file path to validate
 * @throws {RangeError}  If the argument is not a string
 */
export const validatePath = (fnName, argName, path) => {
    const xpx = `${fnName}(): Invalid`; // exception prefix

    if (typeof path !== 'string') throw RangeError(
        `${xpx} ${argName} argument type '${typeof path}', should be 'string'`);
};
