import { equal, throws } from 'node:assert';
import { validateOptionsObject, validateOptionsProps, validatePath } from './validate-arg.js';

/**
 * @typedef {import('./validate-arg.js').OptionsArgument} OptionsArgument
 * @typedef {import('./validate-arg.js').DefaultedOptions} DefaultedOptions
 */

export const testValidateArg = () => {


    // validatePath().

    throws(
        // @ts-expect-error
        () => validatePath('a', 'b'),
        new RangeError("a(): Invalid b argument type 'undefined', should be 'string'"),
        'Missing `path` argument'
    );

    throws(
        () => validatePath('a', 'b', /**@type {string}*/(/**@type {unknown}*/(123))),
        new RangeError("a(): Invalid b argument type 'number', should be 'string'"),
        'Missing `path` argument'
    );

    equal(
        validatePath('a', 'b', 'ok.obj'),
        undefined,
        'Valid input and output paths with custom function name'
    )


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
