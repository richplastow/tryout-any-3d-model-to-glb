/** @fileoverview Converts a 3D model to GBL format */

import initAssimpjs from 'assimpjs';
import { VALID_INPUT_EXTENSIONS } from './constants.js';

let assimpjs = null;

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
 * @param {string} filename  The name of the model file
 * @param {Uint8Array<ArrayBuffer>} modelBytes  The raw file content to convert
 * @throws {Error}  If conversion fails
 */
export const convertModel = async (filename, modelBytes) => {
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

    // Initialize AssimpJS, the first time convertModel is called.
    if (assimpjs === null) assimpjs = await initAssimpjs();

    // Create a new AssimpJS file-list object.
    let fileList = new assimpjs.FileList();
    
    fileList.AddFile(filename, modelBytes);

    // Convert file list to GLB version 2.
    // Other formats are "assjson", "gltf", "gltf2" and (version 1) "glb".
    let result = assimpjs.ConvertFileList(fileList, 'glb2');

    // Check if the conversion succeeded.
    if (!result.IsSuccess() || result.FileCount() == 0) {
        throw new Error(`Conversion failed, error code: ${result.GetErrorCode()}`);
    }

    // Return the converted GLB.
    return result.GetFile(0).GetContent();
}
