'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"dev"',
    ENV_CONFIG: '"dev"',
    HTTP_URL: 'http://192.168.3.100:5001',
    SOCKET_URL: 'ws://192.168.3.100:8032/ws/'
})
