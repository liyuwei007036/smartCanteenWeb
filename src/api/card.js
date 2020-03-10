import axios from '@/api/index';

let list = (data) => {
    return axios({
        method: 'post',
        url: `/icCard/list`,
        data
    })
}

let beforeGetCard = (data) => {
    return axios({
        method: 'get',
        url: `/icCard/before/get/card`,
        data
    })
}

let getCard = (data) => {
    return axios({
        method: 'get',
        url: `/icCard/get/card`,
        data
    })
}

let patch = (data) => {
    return axios({
        method: 'post',
        url: `/icCard/patch`,
        data
    })
}

let loss = (data) => {
    return axios({
        method: 'put',
        url: `/icCard/report/loss/${data}`,
        data
    })
}

export {
    list,
    beforeGetCard,
    getCard,
    loss,
    patch
}