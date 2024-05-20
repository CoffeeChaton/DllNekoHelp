'use strict';

const esbuild = require('esbuild');
const args = process.argv.slice(2);
const isDev = args.includes('--isDev');

esbuild
    .build({
        // define:DEBUG=false
        // entryNames: '[dir]/neko',
        // keepNames: true,
        // mainFields: ['module', 'main'],
        // splitting: true,
        // tsconfig
        // watch: false,
        bundle: true,
        entryPoints: ['./src/extension.ts'],
        external: ['vscode', '@vscode/test-electron'], // not bundle 'vscode' && https://github.com/modfy/nominal
        format: 'cjs',
        logLevel: 'info',
        minify: false,
        outdir: 'dist',
        platform: 'node',
        sourcemap: isDev,
        target: ['es2022', 'node16.17'],
        treeShaking: true,
    })
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
