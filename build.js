const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const minify = require('rollup-plugin-babel-minify')
const resolve = require('rollup-plugin-node-resolve')

const pluginBabel = babel({
  babelrc: false,
  externalHelpers: true,
  exclude: 'node_modules/**',
  presets: [['env', { modules: false }], 'react'],
  plugins: [
    'external-helpers',
    'transform-class-properties',
    'transform-object-rest-spread'
  ]
})
const pluginMinify = minify({ comments: false })
const pluginResolve = resolve()

const rollupConfig = (...plugins) => ({
  input: './src/Tippy.js',
  plugins: [pluginBabel, pluginResolve, ...plugins],
  external: ['react', 'prop-types']
})
const output = format => file => ({
  name: 'Tippy',
  format,
  file,
  sourcemap: true,
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
    'tippy.js': 'tippy'
  }
})

const umd = output('umd')
const esm = output('es')

const build = async () => {
  const bundle = await rollup(rollupConfig())
  const bundleMin = await rollup(rollupConfig(pluginMinify))

  bundle.write(umd('./dist/Tippy.js'))
  bundleMin.write(umd('./dist/Tippy.min.js'))
  bundle.write(esm('./dist/esm/Tippy.js'))
  bundleMin.write(esm('./dist/esm/Tippy.min.js'))
}

build()
