import axios from '@/api/index';

let list = (data) => {
    return axios({
        method: 'post',
        url: `/icCard/list`,
        data
    })
}

export {
    list,
}