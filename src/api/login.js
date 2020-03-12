import axios from '@/api/index';

let login = (data) => {
    return axios({
        method: 'post',
        url: `/employee/login`,
        data
    })
}

let loginOut = () => {
    return axios({
        method: 'delete',
        url: `/employee/loginout`
    })
}


export {
    login,
    loginOut
}
