import axios from '@/api/index';

let listImages = (pdfUuid) => {
  return axios({
    method: 'get',
    url: `/pdf/list/pdf/image/${pdfUuid}`,
  })
}
export {
  listImages
}
