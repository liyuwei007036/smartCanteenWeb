// const HTTP_URL = 'http://47.114.176.72:81/smj/'
// const SOCKET_URL = 'ws://47.114.176.72:81/ws/'
'use strict'
const HTTP_URL = process.env.VUE_APP_URL
const SOCKET_URL = process.env.VUE_APP_SOCKET_URL
export {
    HTTP_URL,
    SOCKET_URL,
}