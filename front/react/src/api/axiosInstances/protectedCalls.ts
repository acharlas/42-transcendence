import axios from "axios";

import { refreshTokens } from "../refresh-api";

const axiosWithAuth = axios.create({
  baseURL: "https://5.182.18.157:443",
});

axiosWithAuth.interceptors.request.use(
  (request) => {
    // //console.log(request);
    const token = window.sessionStorage.getItem("AccessToken");
    if (token) {
      request.headers["Authorization"] = "Bearer " + token;
    } else {
      //console.log("Missing auth token in a protected call.");
    }
    return request;
  },
  (error) => {
    // //console.log(error);
    return Promise.reject(error);
  }
);

axiosWithAuth.interceptors.response.use(
  (response) => {
    // //console.log(response);
    return response;
  },
  async (error) => {
    if (error.config._retry) {
      //console.log("Already retried request");
      return Promise.reject(error);
    }

    if (error?.response?.status === 401) {
      //we redirect to 2FA challenge if needed
      if (error?.response?.data?.message === "2FA required") {
        //console.log("Missing 2fa: redirecting to 2fa page.");
        window.location.href = "/mfa-signin";
      }

      //we request a refresh if needed
      else {
        //console.log("Auth expired: trying to refresh access token");
        try {
          await refreshTokens();
        } catch (e) {
          //console.log("Auth expired: refresh FAILED: redirecting to home.");
          window.location.href = "/";
          return;
        }
        //console.log("Auth expired: refresh SUCCESS");

        //retry but only once to avoid inf loop
        var originalConfig = error.config;
        originalConfig._retry = true;
        return axiosWithAuth(originalConfig);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosWithAuth;
