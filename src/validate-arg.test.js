import assert, { equal, throws } from 'node:assert';
import { validateOptionsObject, validateOptionsProps, validatePath } from './validate-arg.js';

/**
 * @typedef {import('./validate-arg.js').OptionsArgument} OptionsArgument
 * @typedef {import('./validate-arg.js').DefaultedOptions} DefaultedOptions
 */

export const testValidateArg = () => {


    // validatePath().

    throws(
        // @ts-expect-error
        () => validatePath('a', 'inputPath'),
        new RangeError("a(): Invalid inputPath argument type 'undefined', should be 'string'"),
        'Missing `path` argument'
    );

    throws(
        () => validatePath('a', 'outputPath', /**@type {string}*/(/**@type {unknown}*/(123))),
        new RangeError("a(): Invalid outputPath argument type 'number', should be 'string'"),
        'Missing `path` argument'
    );

    throws(
        () => validatePath('a', 'inputPath', ''),
        new RangeError("a(): Invalid inputPath argument is an empty string, should be a valid file path"),
        'Invalid `path` argument type'
    );

    throws(
        () => validatePath('a', 'outputPath', 'a'.repeat(1000 + 1)),
        new RangeError("a(): Invalid outputPath argument length 1001 exceeds maximum of 1000 characters"),
        'Excessively long `path` argument'
    );

    throws(
        () => validatePath('a', 'inputPath', 'invalid|name.obj'),
        new RangeError("a(): Invalid inputPath argument 'invalid|name.obj' contains invalid characters for file paths"),
        'Invalid characters in `path` argument'
    );

    throws(
        () => validatePath('a', 'outputPath', 'ext.is-invalid'),
        new RangeError("a(): Invalid outputPath argument has no valid file extension"),
        'No file extension in `path` argument'
    );

    throws(
        () => validatePath('a', 'inputPath', 'model.xyz'),
        new RangeError("a(): Invalid inputPath argument extension '.xyz' is not a supported 3D model format"),
        'Invalid input file extension in `path` argument'
    );

    throws(
        () => validatePath('a', 'outputPath', 'model.stl'),
        new RangeError("a(): Invalid outputPath argument extension '.stl' is not supported, should be '.glb'"),
        'Invalid output file extension in `path` argument'
    );

    equal(
        validatePath('a', 'inputPath', '/a'.repeat((1000 - 4) / 2) + '.stl'),
        undefined,
        'Valid input path'
    );
    
    equal(
        validatePath('a', 'outputPath', '/a'.repeat((1000 - 4) / 2) + '.glb'),
        undefined,
        'Valid output path'
    );


    // validateOptionsObject().

    throws(
        () => validateOptionsObject('a', null),
        new RangeError("a(): Invalid options argument is null, should be a plain object"),
        'Null `options` argument'
    );

    throws(
        () => validateOptionsObject('a', /**@type {OptionsArgument}*/(/**@type {unknown}*/([]))),
        new RangeError("a(): Invalid options argument is an array, should be a plain object"),
        'Array `options` argument'
    );

    throws(
        () => validateOptionsObject('a', /**@type {OptionsArgument}*/(/**@type {unknown}*/('str'))),
        new RangeError("a(): Invalid options argument type 'string', should be 'object'"),
        'String `options` argument'
    );

    equal(
        validateOptionsObject('a', {}),
        undefined,
        'Valid empty `options` object'
    );


    // validateOptionsProps().

    throws(
        () => validateOptionsProps('a',
            /**@type {DefaultedOptions}*/(/**@type {unknown}*/({ invalidProp: 123 }))),
        new RangeError("a(): options.invalidProp is not a recognised option name"),
        'Invalid option property name'
    );

    throws(
        () => validateOptionsProps('a',
            /**@type {DefaultedOptions}*/(/**@type {unknown}*/({ noticeLevel: 'high' }))),
        new RangeError("a(): Invalid options.noticeLevel type 'string', should be 'number'"),
        'Invalid `noticeLevel` option type'
    );

    throws(
        () => validateOptionsProps('a', { noticeLevel: 5 }),
        new RangeError("a(): Invalid options.noticeLevel should be 1, 2, 3, or 4"),
        'Invalid `noticeLevel` option value'
    );

    equal(
        validateOptionsProps('a', { noticeLevel: 2 }),
        undefined,
        'Valid `noticeLevel` option value'
    );

    console.log('OK: All validate-arg.js tests passed!');
}
