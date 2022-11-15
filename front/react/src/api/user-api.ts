import customAxios from "./customAxios";

export interface GetUserDto {
  id: string,
}
export interface PatchNicknameDto {
  nickname: string,
}

//Get data for a specific user.
export const getUser = async (params: GetUserDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.get(`http://localhost:3333/users/` + params.id,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in getUser", e);
        return reject(e);
      });
  });
};

//Get data of all users.
export const getUsers = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.get(`http://localhost:3333/users/`,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in getUsers", e);
        return reject(e);
      });
  });
}

//Get data of logged-in user.
export const getUsersMe = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.get(`http://localhost:3333/users/me`,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in getUsersMe", e);
        return reject(e);
      });
  });
};

export const patchNickname = async (params: PatchNicknameDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.patch(`http://localhost:3333/users`,
      { nickname: params.nickname },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in patchNickname", e);
        return reject(e);
      });
  });
};
