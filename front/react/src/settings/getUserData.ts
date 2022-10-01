import axios from "axios";

type User = {
  username: string
  nickname: string
  mfaEnabled: boolean
}

export const getUserData = async (): Promise<User> => {
  return new Promise<User>((resolve, reject) => {
    axios.get("http://localhost:3333/users/me",
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((err) => {
        console.log({ err });
        return reject(err);
      });
  });
};
