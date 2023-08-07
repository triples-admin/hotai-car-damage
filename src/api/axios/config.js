import axios from 'axios';
import queryString from 'query-string';
import { configGlobal } from '../endpoint';

const axiosCustom = axios.create({
  baseURL: configGlobal.serverAPI,
  timeout: 300000, // 5 minutes
  headers: {
    'Ocp-Apim-Subscription-Key': 'ab3cf72b9f5d42a68262ac1268f66c25',
    'User-Agent': 'ToyotaEvaapp/2307Prod',
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
