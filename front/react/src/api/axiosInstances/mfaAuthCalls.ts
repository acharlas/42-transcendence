import axios from 'axios';

const axiosMfaAuth = axios.create({
  baseURL: 'http://localhost:3333',
});

axiosMfaAuth.interceptors.request.use(
  (request) => {
    // console.log(request);
    const token = window.sessionStorage.getItem('AccessToken');
    if (token) {
      request.headers['Authorization'] = 'Bearer ' + token;
    } else {
      console.log('Missing auth token in a mfa auth call.');
    }
    return request;
  },
  (error) => {
    // console.log(error);
    return Promise.reject(error);
  },
);

axiosMfaAuth.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  },
);

export default axiosMfaAuth;
