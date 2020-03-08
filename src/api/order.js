import axios from '@/api/index';

let list = (data) => {
    return axios({
        method: 'post',
        url: `/order/list`,
        data
    })
}

export {
    list
}