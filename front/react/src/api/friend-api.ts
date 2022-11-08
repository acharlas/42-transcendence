import axios from "axios";

export interface FriendDto {
  id: string,
}

export const addFriend = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.post(
      `http://localhost:3333/friend/add/`,
      { userId: params.id },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in addFriend", e);
        return reject(e);
      });
  });
}

export const removeFriend = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.post(
      `http://localhost:3333/friend/remove/`,
      { userId: params.id },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in removeFriend", e);
        return reject(e);
      });
  });
}

export const getFriend = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.get(`http://localhost:3333/friend/` + params.id,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in getFriend", e);
        return reject(e);
      });
  });
}

//utils

export const checkIfFriend = async (params: FriendDto): Promise<boolean> => {
  const friendList = (await getFriend({ id: sessionStorage.getItem(`userid`) })).data.myfriend;
  for (let i = 0; i < friendList.length; i++) {
    if (friendList[i].id === params.id) {
      return (true);
    }
  }
  return (false);
}
