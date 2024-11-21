const path = require('path');


module.exports = {
    name: 'host',
    shared: ['react', 'react-dom'],
    runtimePlugins: [path.resolve(__dirname, './offline-remote.js')],
}
