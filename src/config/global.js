// const HTTP_URL = 'http://47.114.176.72:81/smj/'
// const SOCKET_URL = 'ws://47.114.176.72:81/ws/'
'use strict'
// 根据环境引入不同配置 process.env.ENV_CONFIG  ex:dev.conf.js
const config = require('../../config/' + process.env.ENV_CONFIG + '.env.js')
const HTTP_URL = config.HTTP_URL
const SOCKET_URL = config.SOCKET_URL
export {
    HTTP_URL,
    SOCKET_URL,
}