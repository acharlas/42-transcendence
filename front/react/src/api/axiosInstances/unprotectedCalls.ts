import axios from "axios";

const axiosNoAuth = axios.create({
  baseURL: "http://5.182.18.157:3333",
});

axiosNoAuth.interceptors.request.use(
  (request) => {
    // //console.log(request);
    return request;
  },
  (error) => {
    // //console.log(error);
    return Promise.reject(error);
  }
);

axiosNoAuth.interceptors.response.use(
  (response) => {
    // //console.log(response);
    return response;
  },
  async (error) => {
    // //console.log(error);
    return Promise.reject(error);
  }
);

export default axiosNoAuth;
