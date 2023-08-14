import axios from 'axios';
import queryString from 'query-string';
import { configGlobal } from '../endpoint';

const axiosCustom = axios.create({
  baseURL: configGlobal.serverAPI,
  timeout: 300000, // 5 minutes
  headers: {
    'Ocp-Apim-Subscription-Key': '149625204d9248d7a343d83b46cd8ab9',
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
