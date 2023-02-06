import axiosWithAuth from "./axiosInstances/protectedCalls";

//Get user Achievement.
export const getAchievement = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    console.log("axios call");
    axiosWithAuth
      .get("Users/achievement/me")
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in getAchivement", e);
        return reject(e);
      });
  });
};
