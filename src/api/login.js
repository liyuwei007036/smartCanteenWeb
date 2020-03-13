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

let changePassword = (data) => {
    return axios({
        method: 'post',
        url: `/employee/changePassword`,
        data
    })
}


export {
    login,
    loginOut,
    changePassword
}
