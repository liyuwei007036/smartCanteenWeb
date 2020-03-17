import axios from '@/api/index';

const lineChat = () => {
    return axios({
        method: 'get',
        url: `/order/summary`,
    })
}

export {
    lineChat,
}