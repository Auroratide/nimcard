import * as path from 'path'
import svelte from 'rollup-plugin-svelte'
import css from 'rollup-plugin-css-only'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'

// const production = !process.env.ROLLUP_WATCH
const production = false

export default [ {
    input: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
        sourcemap: true,
        format: 'es',
        name: 'nimcard-game',
        file: path.resolve(__dirname, 'lib', 'index.js'),
    },
    external: [
        path.resolve(__dirname, '..', 'nimcard', 'lib', 'index.js')
    ],
    plugins: [
        // Compile svelte program
        svelte({
            preprocess: sveltePreprocess(),
            compilerOptions: {
                dev: !production
            }
        }),
        
        // Collect CSS into a file, for browser performance
        css({
            output: 'style.css'
        }),

        // Resolve dependencies
        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        typescript({
            tsconfig: path.resolve(__dirname, 'tsconfig.json'),
            sourceMap: !production,
            inlineSources: !production,
        }),

        // Refresh browser when changes occur in public
        // !production && livereload('public'),

        // Minify for production
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
}, {
    input: path.resolve(__dirname, 'src', 'define.js'),
    output: {
        sourcemap: false,
        format: 'es',
        name: 'define',
        file: path.resolve(__dirname, 'lib', 'define.js'),
    },
    external: [
        path.resolve(__dirname, 'src', 'index.js')
    ],
    plugins: [
        production && terser(),
    ]
} ]
