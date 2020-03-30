import axios from '@/api/index';

const other = (data) => {
    return axios({
        method: 'post',
        url: `/order/summary/other`,
        data
    })
}

const yearChat = () => {
    return axios({
        method: 'get',
        url: `/order/summary/year`,
    })
}

const monthChat = () => {
    return axios({
        method: 'get',
        url: `/order/summary/month`,
    })
}

const dayChat = () => {
    return axios({
        method: 'get',
        url: `/order/summary/day`,
    })
}


export {
    other,
    yearChat,
    monthChat,
    dayChat,
}