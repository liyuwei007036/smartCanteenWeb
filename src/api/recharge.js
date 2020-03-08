import axios from '@/api/index';

let recharge = (data) => {
    return axios({
        method: 'post',
        url: `/recharge/recharge`,
        data
    })
}

let list = (data) => {
    return axios({
        method: 'post',
        url: `/recharge/list/log`,
        data
    })
}

export {
    recharge,
    list
}