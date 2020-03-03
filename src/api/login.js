import axios from '@/api/index';

let login = (data) => {
    return axios({
        method: 'post',
        url: `/user/login`,
        data
    })
}


export {
    login
}
