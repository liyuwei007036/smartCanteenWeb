import axios from '@/api/index';

let getRoot = (data) => {
    return axios({
        method: 'get',
        url: `/origination/getRoot`,
        data
    })
}

let getNodes = (data) => {
    return axios({
        method: 'get',
        url: `/origination/get/nodes/${data}`,
        data
    })
}

let get = (data) => {
    return axios({
        method: 'get',
        url: `/origination/get/${data}`,
        data
    })
}

let update = (data) => {
    return axios({
        method: 'patch',
        url: `/origination/update`,
        data
    })
}

let add = (data) => {
    return axios({
        method: 'post',
        url: `/origination/add`,
        data
    })
}

let deleted = (data) => {
    return axios({
        method: 'delete',
        url: `/origination/deleted/${data}`,
        data
    })
}



export {
    getRoot,
    getNodes,
    update,
    add,
    deleted,
    get
}