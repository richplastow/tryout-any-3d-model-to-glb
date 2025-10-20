import { any3dModelToGlb } from '../../dist/any-3d-model-to-glb.js';

/**
 * @typedef {import('./src/types.js').WriteFile} WriteFile
 */

/** #### Runs example 01 - converts a simple cube.obj to GLB format
 * 
 * @param {WriteFile} [writeFile] Optional async function to write a file - useful for testing
 */
export const example01 = async (writeFile) => {
    const inputPath = './examples/01-cube-obj/cube.obj';
    const outputPath = './example-outputs/example-01-cube.glb';
    return any3dModelToGlb(
        inputPath,
        outputPath,
        { noticeLevel: 1 },
        void 0,
        writeFile,
    );
};


// Run example 01 if this file was called directly by Node.js.
if (
    typeof process === 'object' && // is probably Node
    process.argv[1] && // has a 2nd item...
    process.argv[1][0] === '/' && // ...which starts "/"
    import.meta.url && // has a current filename...
    import.meta.url.slice(0, 8) === 'file:///' && // ...which starts "file:///"
    process.argv[1] === decodeURIComponent(import.meta.url).slice(7) // they match
) {
    const { didSucceed, notices } = await example01();
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
