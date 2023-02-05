import axiosWithAuth from "./axiosInstances/protectedCalls";

//Get user history.
export const getHistory = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    console.log("axios call");
    axiosWithAuth
      .get("/history/me")
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in getHistory", e);
        return reject(e);
      });
  });
};
