import axios from "axios";
//used by custom axios but we use base axios instances here
import axiosWithAuth from "./axiosInstances/protectedCalls";

export const refreshTokens = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get("https://astropong.cossetheo.com/auth/refresh", {
        headers: {
          Authorization: "Bearer " + window.sessionStorage.getItem("RefreshToken"),
        },
      })
      .then((r) => {
        // //console.log('Old tokens:');
        // //console.log(window.sessionStorage.getItem('AccessToken'));
        // //console.log(window.sessionStorage.getItem('RefreshToken'));
        window.sessionStorage.setItem("AccessToken", r.data.access_token);
        window.sessionStorage.setItem("RefreshToken", r.data.refresh_token);
        // //console.log('New tokens:');
        // //console.log(window.sessionStorage.getItem('AccessToken'));
        // //console.log(window.sessionStorage.getItem('RefreshToken'));
        return resolve(r);
      })
      .catch((e) => {
        //console.log("Error in refreshTokens", e);
        return reject(e);
      });
  });
};

export const deleteRefreshToken = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .delete("/auth/logout")
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        //console.log("Error in deleteRefreshToken", e);
        return reject(e);
      });
  });
};
