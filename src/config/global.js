// const HTTP_URL = 'http://47.114.176.72:81/smj/'
// const SOCKET_URL = 'ws://47.114.176.72:81/ws/'
'use strict'
const HTTP_URL = process.env.VUE_APP_URL
const SOCKET_URL = process.env.VUE_APP_SOCKET_URL
const AES_KEY = process.env.VUE_APP_AES_KEY
const AES_IV = process.env.VUE_APP_AES_IV
const TELNET_ID = process.env.VUE_APP_TELNET_ID
export {
    HTTP_URL,
    SOCKET_URL,
    AES_IV,
    AES_KEY,
    TELNET_ID
}