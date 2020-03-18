import axios from '@/api/index';

const lineChat = () => {
    return axios({
        method: 'get',
        url: `/order/summary`,
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
    lineChat,
    yearChat,
    monthChat,
    dayChat,
}