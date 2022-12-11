import axios from 'axios';

import { refreshTokens } from '../refresh-api';

const axiosWithAuth = axios.create({
  baseURL: 'http://localhost:3333',
});

axiosWithAuth.interceptors.request.use(
  (request) => {
    // console.log(request);
    const token = window.sessionStorage.getItem('AccessToken');
    if (token) {
      request.headers['Authorization'] = 'Bearer ' + token;
    } else {
      console.log('Missing auth token in a protected call.');
    }
    return request;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  },
);

axiosWithAuth.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response;
  },
  async (error) => {
    if (error.config._retry) {
      console.log('Already retried request');
      return Promise.reject(error);
    }

    const originalConfig = error.config;

    if (error?.response?.status === 401) {
      //we redirect to 2FA challenge if needed
      if (error?.response?.data?.message === '2FA required') {
        console.log('Missing 2fa: redirecting to 2fa page.');
        window.location.href = '/mfa-signin';
      }

      //we request a refresh if needed
      else {
        console.log('Trying to refresh token in case auth expired.');
        await refreshTokens();
        console.log('Auth expired: refresh token ok');
        originalConfig._retry = true;
        return axiosWithAuth(originalConfig);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosWithAuth;
