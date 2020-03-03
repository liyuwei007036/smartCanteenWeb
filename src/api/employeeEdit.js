import axios from '@/api/index';

let employeeEdit = (data) => {
    return axios({
        method: 'get',
        url: `/employee/get/${data}`,
        data
    })
}


export {
    employeeEdit
}
