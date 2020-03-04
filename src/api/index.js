import axios from 'axios';
import {Message} from 'element-ui'

axios.defaults.timeout = 50000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://192.168.3.11:5001';


const reqList = []

/**
 * 阻止重复请求
 */
const stopRepeatRequest = function (url, cancel, errorMessage) {
    const errorMsg = errorMessage || ''
    for (let i = 0; i < reqList.length; i++) {
        if (reqList[i] === url) {
            cancel(errorMsg)
            return
        }
    }
    reqList.push(url)
}

/**
 * 允许某个请求可以继续进行
 */
const allowRequest = function (url) {
    for (let i = 0; i < reqList.length; i++) {
        if (url.endsWith(reqList[i])) {
            reqList.splice(i, 1)
            break
        }
    }
}

//设置请求拦截
axios.interceptors.request.use(config => {
    let cancel
    //设置cancelToken对象
    config.cancelToken = new axios.CancelToken(function (c) {
        cancel = c
    })

    //阻止重复请求，当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(config.url + '&' + config.method, cancel, '${config.url} request cancel')
    // config.headers = buildHeaders() || {}
    config.headers['content-type'] = 'application/json'
    // config.headers['X-lang-Id'] = localStorage.getItem(LANG.LOCALE)
    return config
}, err => {
    return Promise.reject(err)
})

let loginURL = '/employee/login'
// 响应拦截器
axios.interceptors.response.use(response => {
    //增加延迟，相同请求不得在短时间内重复发送
    setTimeout(() => {
        allowRequest(response.config.url + '&' + response.config.method)
    }, 500)
    let data = response.data
    if (data.code === 1000) {
        return data
    } else if (data.code === 1002) {
        console.log('跳转登录页面')
    } else {
        Message({
            message: data.msg,
            type: 'error',
            center: true
        })
        return data
    }
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 408://超时
                Message.error('Timeout')
                break
            case 500:
                Message.error('Server error')
                break
            default:
                Message.error('连接服务器失败')
        }
        setTimeout(() => {
            allowRequest(error.response.config.url + '&' + error.response.config.method)
        }, 500)
    }
})

// axios.interceptors.request.use(config => config,
//     error => Promise.error(error));


// 响应拦截器
// axios.interceptors.response.use(
//     (response) => {
//         // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
//         // 否则的话抛出错误
//         if (response.status === 200 && response.data.code === 1000) {
//             return response;
//         } else {
//
//         }
//     },
//     error => Promise.reject(error.response),
// );


export default axios;
