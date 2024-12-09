import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosCustom from './config';

const isTest = false;

const caseListPage = {
  getConfig: (body, config) => {
    const url = `LEVAAPP001_Q01`;
    if (isTest) {
      body = {
        ...body, 'USERID': 'AA11010', 'BRNHCD': '53', 'DLRCD': 'A'
      };
    }
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        console.log('response', response)
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  sendPicture: (body, config) => {
    const url = `LEVAAPP001_Q01`;
    if (isTest) {
      body = {
        ...body, 'USERID': 'AA11010', 'BRNHCD': '53', 'DLRCD': 'A'
      };
    }
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
