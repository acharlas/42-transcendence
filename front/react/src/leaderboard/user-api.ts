import axios from "axios";

export const getUsers = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.get(`http://localhost:3333/users/`,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((e) => {
        console.log(e);
        return reject(e);
      });
  });
}
