import axiosWithAuth from './axiosInstances/protectedCalls';

export interface FriendDto {
  id: string;
}

export const addFriend = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .post('/friend/add/', { userId: params.id })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log('Error in addFriend', e);
        return reject(e);
      });
  });
};

export const removeFriend = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .post('/friend/remove/', { userId: params.id })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log('Error in removeFriend', e);
        return reject(e);
      });
  });
};

export const getFriend = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .get('/friend/' + params.id)
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log('Error in getFriend', e);
        return reject(e);
      });
  });
};

//utils

export const checkIfFriend = async (params: FriendDto): Promise<boolean> => {
  const friendList = (await getFriend({ id: sessionStorage.getItem('userid') }))
    .data.myfriend;
  for (let i = 0; i < friendList.length; i++) {
    if (friendList[i].id === params.id) {
      return true;
    }
  }
  return false;
};
