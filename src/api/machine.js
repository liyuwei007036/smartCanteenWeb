import axios from '@/api/index';

let add = (data) => {
    return axios({
        method: 'post',
        url: `/machine/add`,
        data
    })
}

let update = (data) => {
    return axios({
        method: 'post',
        url: `/machine/update`,
        data
    })
}

let page = (data) => {
    return axios({
        method: 'post',
        url: `/machine/list`,
        data
    })
}

let remove = (id) => {
    return axios({
        method: 'delete',
        url: `/machine/delete/${id}`,
    })
}

let get = (id) => {
    return axios({
        method: 'get',
        url: `/machine/get/${id}`,
    })
}


export {
    add,
    update,
    page,
    remove,
    get
}