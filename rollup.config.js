import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';

const entrypoint = 'main';
const outputDir = 'dist';

export default {
  input: `src/${entrypoint}.js`,
  output: [
    { file: `${outputDir}/${entrypoint}.js`, name: 'ElectionResult', format: 'iife' },
    { file: `${outputDir}/${entrypoint}.min.js`, name: 'ElectionResult', format: 'iife' },
  ],
  plugins: [
    resolve(),
    commonjs(),
    vue(),
    babel({
      configFile: false,
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { modules: false, useBuiltIns: 'usage', corejs: '3' }],
      ],
    }),
    terser({
      include: [/^.+\.min\.js$/, '*esm*'], 
    }),
  ],
};
