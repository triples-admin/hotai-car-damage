import axios from 'axios';
import queryString from 'query-string';
import { configGlobal } from '../endpoint';

const axiosCustom = axios.create({
  baseURL: configGlobal.serverAPI,
  timeout: 300000, // 5 minutes
  headers: {
    'Ocp-Apim-Subscription-Key': '9ac46c6328914575b9088a8ad2219ec7', //正式版
    'User-Agent': 'LexusEvaapp/2308prod',
    'content-type': 'application/json',
  },
  paramsSerializer: (param) => queryString.stringify(param),
});

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosCustom;
