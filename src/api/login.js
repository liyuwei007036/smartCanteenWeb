import axios from '@/api/index';

let login = (data) => {
    return axios({
        method: 'post',
        url: `/employee/login`,
        data
    })
}


export {
    login
}
