import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const dev = process.argv.indexOf('-w') > -1;


const plugins = [
    resolve(),
    typescript(),
    commonjs()
];

if (!dev) {
    plugins.unshift(peerDepsExternal());
    plugins.push(terser());
} else {
    plugins.push(
        replace(({
            'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
        })),
        babel({
            "exclude": "node_modules/**",
            "presets": ["@babel/env", "@babel/preset-react"]
        }),
        serve(['dist', 'public'])
    )
}

const lib = {
    input: 'lib/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs'
        },
        {
            file: pkg.module,
            format: 'esm'
        }
    ],
    plugins
};

const exampleClient = {
    input: 'example/index.jsx',
    output: {
        file: 'public/index.js',
        format: 'iife'
    },
    plugins: [
        ...plugins
    ],
    watch: {
        exclude: 'node_modules/**'
    }
};
export default dev ? exampleClient : lib;
