import customAxios from "./customAxios";

export interface BlockDto {
  id: string,
}

export const addBlock = async (params: BlockDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.post(
      `http://localhost:3333/block/add/`,
      { userId: params.id },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in addBlock", e);
        return reject(e);
      });
  });
}

export const removeBlock = async (params: BlockDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.post(
      `http://localhost:3333/block/remove/`,
      { userId: params.id },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in removeBlock", e);
        return reject(e);
      });
  });
}

export const getBlock = async (params: BlockDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.get(`http://localhost:3333/block/` + params.id,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in getBlock", e);
        return reject(e);
      });
  });
}

//utils

export const checkIfBlocked = async (params: BlockDto): Promise<boolean> => {
  const blockList = (await getBlock({ id: sessionStorage.getItem(`userid`) })).data.myblock;
  for (let i = 0; i < blockList.length; i++) {
    if (blockList[i].id === params.id) {
      return (true);
    }
  }
  return (false);
}
