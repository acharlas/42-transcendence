import axiosWithAuth from './axiosInstances/protectedCalls';

export interface GetUserDto {
  id: string;
}
export interface PatchNicknameDto {
  nickname: string;
}

//Get data for a specific user.
export const getUser = async (params: GetUserDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .get('/users/' + params.id)
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log('Error in getUser', e);
        return reject(e);
      });
  });
};

//Get data of all users.
export const getUsers = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .get('/users/')
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log('Error in getUsers', e);
        return reject(e);
      });
  });
};

//Get data of logged-in user.
export const getUsersMe = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .get('/users/me')
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log('Error in getUsersMe', e);
        return reject(e);
      });
  });
};

export const patchNickname = async (params: PatchNicknameDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .patch('/users', { nickname: params.nickname })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log('Error in patchNickname', e);
        return reject(e);
      });
  });
};
