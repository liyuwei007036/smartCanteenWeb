import axios from '@/api/index';

let employeeList = (data) => {
    return axios({
        method: 'post',
        url: `/employee/list`,
        data
    })
}


export {
    employeeList
}
