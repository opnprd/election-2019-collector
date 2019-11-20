import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const entrypoint = 'main';
const outputDir = 'dist';

export default {
  input: `src/${entrypoint}.js`,
  output: [
    { file: `${outputDir}/${entrypoint}.js`, format: 'iife' },
    { file: `${outputDir}/${entrypoint}.min.js`, format: 'iife' },
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      configFile: false,
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { modules: false }],
      ],
    }),
    terser({
      include: [/^.+\.min\.js$/, '*esm*'], 
    }),
  ],
};
