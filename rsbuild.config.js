
const { pluginReact } = require('@rsbuild/plugin-react')
const { pluginSass } = require('@rsbuild/plugin-sass')
const path = require('node:path')
const mfConfig = require('./mfconfig')
const { ModuleFederationPlugin } = require('@module-federation/enhanced/rspack');

module.exports = {
  plugins: [
    pluginReact({ splitChunks: { react: false, router: false } }),
    pluginSass({
      sassLoaderOptions: {
        sassOptions: {
          silenceDeprecations: ['import', 'global-builtin', 'abs-percent', 'color-functions', 'mixed-decls'],
        },
      },
    }),
  ],
  html: {
    template: path.resolve(process.cwd(), 'public/index.html'),
  },
  server: {
    port: 3000,
    open: '/',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  tools: {
    rspack: {
      plugins:[
        new ModuleFederationPlugin(mfConfig),
      ],
      output: {
        publicPath: 'auto',
      },
    },
  },
  output: {
    distPath: {
      root: 'build',
    },
  },
}
