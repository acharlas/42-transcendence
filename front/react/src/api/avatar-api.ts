import axios from "axios";

export const postAvatar = async (newAvatar: File): Promise<any> => {
  let formdata = new FormData();
  formdata.append("avatar", newAvatar);
  return new Promise<any>((resolve, reject) => {
    axios.post(
      `http://localhost:3333/avatar/`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`),
          'Content-Type': 'multipart/form-data',
        }
      })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in postAvatar", e);
        return reject(e);
      });
  });
}

export const deleteAvatar = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.delete(
      `http://localhost:3333/avatar/`,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in deleteAvatar", e);
        return reject(e);
      });
  });
}

