import axios from "axios";

export interface FriendDto {
  id: string,
}

export interface CheckIfFriendDto {
  sourceId: string,
  targetId: string,
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

export const getFriendlist = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getFriend({ id: params.id })
      .then((ret) => {
        return (resolve(ret.data.myfriend));
      })
      .catch((e) => {
        console.log("Error in getFriendlist", e);
        return reject(e);
      });
  });
}

export const checkIfFriend = async (params: CheckIfFriendDto): Promise<boolean> => {
  const ret = await getFriendlist({ id: sessionStorage.getItem(`userid`) });
  for (let i = 0; i < ret.length; i++) {
    if (ret[i].id === params.targetId) {
      return (true);
    }
  }
  return (false);
}
