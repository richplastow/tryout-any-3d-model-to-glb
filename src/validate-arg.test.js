import { equal, throws } from 'node:assert';
import { validatePath } from './validate-arg.js';

export const testValidateArg = () => {

    throws(
        // @ts-expect-error
        () => validatePath('a', 'b'),
        new RangeError("a(): Invalid b argument type 'undefined', should be 'string'"),
        'Missing `path` argument'
    );

    equal(
        validatePath('a', 'b', 'ok.obj'),
        undefined,
        'Valid input and output paths with custom function name'
    )

    console.log('OK: All validate-arg.js tests passed!');
}
