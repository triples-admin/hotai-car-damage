import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosCustom from './config';

const isTest = false;

const procedure = {
  sendDataMainProcedure: (body, config) => {
    if (isTest) {
      body = {
        ...body, 'USERID': 'AA11010', 'BRNHCD': '53', 'DLRCD': 'A'
      };
    }
    const url = `LEVAAPP001_I01`;
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
  deleteCase: (body, config) => {
    const url = `LEVAAPP001_D01`;
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
  maintenanceContentStorage: (body, config) => {
    const url = `LEVAAPP001_I02`;
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
  getEstimatePrice: (body, config) => {
    const url = `LEVAAPP001_Q03`;
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
  getEVANO: (body, config) => {
    const url = `LEVAAPP001_Q04`;
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
  sendCheckUpload: (body, config) => {
    const url = `LEVAAPP001_I03`;
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
  sendUploadImages: (body, config) => {
    const url = `LEVAAPP001_I04`;
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
export default procedure;
