import axios from "axios";

export interface BlockDto {
  id: string,
}
export interface CheckIfBlockDto {
  sourceId: string,
  targetId: string,
}

export const addBlock = async (params: BlockDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.post(
      `http://localhost:3333/block/add/`,
      { userId: params.id },
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

export const removeBlock = async (params: BlockDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.post(
      `http://localhost:3333/block/remove/`,
      { userId: params.id },
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

export const getBlock = async (params: BlockDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.get(`http://localhost:3333/block/` + params.id,
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

export const getBlocklist = async (params: BlockDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    getBlock({ id: params.id })
      .then((ret) => {
        return (resolve(ret.data.myblock));
      })
      .catch((e) => {
        return reject(e);
      });
  });
}

export const checkIfBlock = async (params: CheckIfBlockDto): Promise<boolean> => {
  const ret = await getBlocklist({ id: sessionStorage.getItem("userid") });
  for (let i = 0; i < ret.length; i++) {
    if (ret[i].id === params.targetId) {
      return (true);
    }
  }
  return (false);
}
