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

export {
    lineChat,
    yearChat,
}