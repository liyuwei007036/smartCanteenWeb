import axios from '@/api/index';

let permission = () => {
    return axios({
        method: 'GET',
        url: `/rolePermission/listAll`
    })
}

let addPermission = (data) => {
    return axios({
        method: 'POST',
        url: `/rolePermission/add`,
        data
    })
}

let getRolePermission = (roleId) => {
    return axios({
        method: 'GET',
        url: `/rolePermission/getPermission/${roleId}`,
    })
}


export {
    permission,
    addPermission,
    getRolePermission
}