import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosCustom from './config';

const caseListPage = {
  getConfig: (body, config) => {
    const url = `EVAAPP001_Q01`;
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  sendPicture: (body, config) => {
    const url = `EVAAPP001_Q01`;
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
};
export default caseListPage;
