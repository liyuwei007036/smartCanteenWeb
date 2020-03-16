import axios from '@/api/index';

let listLogin = (data) => {
    return axios({
        method: 'post',
        url: `/log/list/login`,
        data
    })
}

let listOperation = (data) => {
    return axios({
        method: 'post',
        url: `/log/list/operation`,
        data
    })
}

let get = (data) => {
    return axios({
        method: 'get',
        url: `/log/get/operation/${data}`,
        data
    })
}

export {
    listLogin,
    listOperation,
    get
}