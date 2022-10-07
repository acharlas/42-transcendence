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
    axios.get(`http://localhost:3333/friend/add` + params.id,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log(e);
        return reject(e);
      });
  });
}

export const removeFriend = async (params: FriendDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.get(`http://localhost:3333/friend/remove` + params.id,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log(e);
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
        console.log(e);
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
        return reject(e);
      });
  });
}

export const checkIfFriend = async (params: CheckIfFriendDto): Promise<boolean> => {
  try {
    const ret = await getFriendlist({ id: "b45c2b44-1ac8-4fba-aa7c-c1c82c0158b9" });
    for (let i = 0; i < ret.length; i++) {
      if (ret[i].id === params.targetId) {
        return (true);
      }
    }
    return (false);
  }
  catch (e) {

  };
}
