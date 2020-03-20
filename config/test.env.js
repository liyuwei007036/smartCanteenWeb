'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
    EVN_CONFIG: 'test',
    HTTP_URL: 'http://192.168.3.100:5001/',
    SOCKET_URL: 'ws://192.168.3.100:8032/ws/'
})
