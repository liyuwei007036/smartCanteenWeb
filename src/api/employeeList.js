import axios from '@/api/index';

let list = (data) => {
    return axios({
        method: 'post',
        url: `/employee/list`,
        data
    })
}

let get = (data) => {
    return axios({
        method: 'get',
        url: `/employee/get/${data}`,
        data
    })
}

let update = (data) => {
    return axios({
        method:'patch',
        url:`/employee/update`,
        data
    })
}

let add = (data) => {
    return axios({
        method:'post',
        url:`/employee/add`,
        data
    })
}

let deleted = (data) => {
    return axios({
        method:'delete',
        url:`/icCard/deleted/${data}`,
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
