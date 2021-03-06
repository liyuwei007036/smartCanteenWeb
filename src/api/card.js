import axios from '@/api/index';

let list = (data) => {
    return axios({
        method: 'post',
        url: `/icCard/list`,
        data
    })
}
let rechargeList = (data) => {
    return axios({
        method: 'post',
        url: `/icCard/list/recharge`,
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


let getPatchUser = (data) => {
    return axios({
        method: 'get',
        url: `/icCard/patch/${data}`,
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

let unLoss = (data) => {
    return axios({
        method: 'put',
        url: `/icCard/report/unloss/${data}`,
        data
    })
}

let deduction = (data) => {
    return axios({
        method: 'post',
        url: `/icCard/deduction`,
        data
    })
}

export {
    list,
    beforeGetCard,
    getCard,
    loss,
    patch,
    deduction,
    rechargeList,
    getPatchUser,
    unLoss
}