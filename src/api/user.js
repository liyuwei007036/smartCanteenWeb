import axios from '@/api/index';

let list = (data) => {
    return axios({
        method: 'post',
        url: `/user/list`,
        data
    })
}

let get = (data) => {
    return axios({
        method: 'get',
        url: `/user/get/${data}`,
        data
    })
}

let update = (data) => {
    return axios({
        method:'patch',
        url:`/user/update`,
        data
    })
}

let add = (data) => {
    return axios({
        method:'post',
        url:`/user/add`,
        data
    })
}

let deleted = (data) => {
    return axios({
        method:'delete',
        url:`/user/deleted/${data}`,
        data
    })
}


export {
    list,
    get,
    update,
    add,
    deleted
}