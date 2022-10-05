import axios from "axios";

export interface GetUserDto {
  id: string,
}

export interface User {
  nickname: string,
  wins: number,
  losses: number,
  mmr: number,
}

export const getUser = async (params: GetUserDto): Promise<User> => {
  return new Promise<User>((resolve, reject) => {
    axios.get(`http://localhost:3333/users/` + params.id,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((e) => {
        console.log(e);
        return reject(e);
      });
  });
};
