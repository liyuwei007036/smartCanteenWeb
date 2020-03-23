import axios from 'axios';
import {Message} from 'element-ui'
import router from "../router";
import {HTTP_URL} from '@/config/global'

axios.defaults.timeout = 50000;
axios.defaults.withCredentials = false;
axios.defaults.baseURL = HTTP_URL;

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
    if (config.method !== 'get') {
        stopRepeatRequest(config.url + '&' + config.method, cancel, '${config.url} request cancel')
    }
    //阻止重复请求，当上个请求未完成时，相同的请求不会进行
    config.headers['content-type'] = 'application/json'
    config.headers['x-smart-token'] = sessionStorage.getItem('x-smart-token')
    return config
}, err => {
    return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use(response => {
    if (response.headers['x-smart-token']) {
        sessionStorage.setItem('x-smart-token', response.headers['x-smart-token'])
    }
    if (response.config.method !== 'get') {
        //增加延迟，相同请求不得在短时间内重复发送
        setTimeout(() => {
            allowRequest(response.config.url + '&' + response.config.method)
        }, 500)
    }
    let data = response.data
    if (data && data.code === 1000) {
        return data
    } else if (data && data.code === 1022) {
        router.push({
            path: '/login'
        })
    } else if (data && data.code === 1012) {
        return data
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
        if (error.response.config.method !== 'get') {
            setTimeout(() => {
                allowRequest(error.response.config.url + '&' + error.response.config.method)
            }, 500)
        }
    }
    return {
        code: 0,
    }
})


export default axios;
