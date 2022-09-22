import axios from "axios";

export interface PatchNicknameDto {
  nickname: string;
}
export interface PatchUsernameDto {
  username: string;
}

export const patchNickname = async (params: PatchNicknameDto): Promise<void> => {
  console.log("patchnick service", { params });
  return new Promise<void>((resolve, reject) => {
    axios.patch(
      "http://localhost:3333/users",
      {
        nickname: params.nickname
      },
      {
        headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") }
      },
    )
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((err) => {
        console.log({ err });
        return reject(err);
      });
  });
};

export const patchUsername = async (params: PatchUsernameDto): Promise<void> => {
  console.log("patchname service", { params });
  return new Promise<void>((resolve, reject) => {
    axios.patch(
      "http://localhost:3333/users",
      {
        username: params.username
      },
      {
        headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") }
      },
    )
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((err) => {
        console.log({ err });
        return reject(err);
      });
  });
};
