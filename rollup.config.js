const config = [
    {
        input: 'any-3d-model-to-glb.js',
        output: {
            file: 'docs/any-3d-model-to-glb.js',
            format: 'esm',
            sourcemap: false,
        },
        external: ['node:fs/promises'],
        plugins: []
    }
];

export default config;
