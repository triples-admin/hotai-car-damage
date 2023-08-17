import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosCustom from './config';

const procedure = {
  sendDataMainProcedure: (body, config) => {
    const url = `LEVAAPP001_I01`;
    // console.log( 'I01: ', JSON.stringify(body) );
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  getDataComponentProcedure: (body, config) => {
    const url = `LEVAAPP001_Q02`;
    // console.log( 'Q02: ', JSON.stringify(body) );
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  deleteCase: (body, config) => {
    const url = `LEVAAPP001_D01`;
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  maintenanceContentStorage: (body, config) => {
    const url = `LEVAAPP001_I02`;
    // console.log( 'I02: ', JSON.stringify(body) );
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  getEstimatePrice: (body, config) => {
    const url = `LEVAAPP001_Q03`;
    // console.log( 'Q03: ', JSON.stringify(body) );
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  getEVANO: (body, config) => {
    const url = `LEVAAPP001_Q04`;
    // console.log( 'Q04: ', JSON.stringify(body) );
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  sendCheckUpload: (body, config) => {
    const url = `LEVAAPP001_I03`;
    // console.log( 'I03: ', JSON.stringify(body) );
    return axiosCustom
      .post(url, body, config)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error.response;
      });
  },
  sendUploadImages: (body, config) => {
    const url = `LEVAAPP001_I04`;
    // console.log( 'I04: ', JSON.stringify(body) );
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
export default procedure;
