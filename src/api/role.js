import axios from '@/api/index';

let list = (data) => {
    return axios({
        method: 'post',
        url: `/role/list`,
        data
    })
}

let get = (data) => {
    return axios({
        method: 'get',
        url: `/role/get/${data}`,
        data
    })
}

let update = (data) => {
    return axios({
        method:'patch',
        url:`/role/update`,
        data
    })
}

let add = (data) => {
    return axios({
        method:'post',
        url:`/role/add`,
        data
    })
}

let deleted = (data) => {
    return axios({
        method:'delete',
        url:`/role/deleted/${data}`,
        data
    })
}

let listAllRole = (data) => {
    return axios({
        method:'get',
        url:`/role/listAll`,
        data
    })
}


export {
    list,
    get,
    update,
    add,
    deleted,
    listAllRole
}