import axiosWithAuth from "./axiosInstances/protectedCalls";

export const postAvatar = async (newAvatar: File): Promise<any> => {
  let formdata = new FormData();
  formdata.append("avatar", newAvatar);
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .post("/avatar/", formdata)
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        //console.log('Error in postAvatar', e);
        return reject(e);
      });
  });
};

export const deleteAvatar = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .delete("/avatar/")
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        //console.log('Error in deleteAvatar', e);
        return reject(e);
      });
  });
};
