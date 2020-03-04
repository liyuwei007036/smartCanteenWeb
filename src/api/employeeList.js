import axios from '@/api/index';

let employeeList = (data) => {
    return axios({
        method: 'post',
        url: `/employee/list`,
        data
    })
}

let employeeEdit = (data) => {
    return axios({
        method: 'get',
        url: `/employee/get/${data}`,
        data
    })
}

let employeeUpdate = (data) => {
    return axios({
        method:'patch',
        url:`/employee/update`,
        data
    })
}

let employeeAdd = (data) => {
    return axios({
        method:'post',
        url:`/employee/add`,
        data
    })
}

export {
    employeeList,
    employeeEdit,
    employeeUpdate,
    employeeAdd
}
