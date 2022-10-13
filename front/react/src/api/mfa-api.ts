import axios from "axios";

export interface checkMfaDto {
  codeToCheck: string,
}

export interface activateMfaDto {
  phoneNumber: string,
}

export const requestMfaDisable = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.delete(`http://localhost:3333/mfa/disable`,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((e) => {
        return reject(e);
      });
  })
}

export const requestMfaSetupInit = async (params: activateMfaDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.post(`http://localhost:3333/mfa/setup/init`,
      { phoneNumber: params.phoneNumber },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((e) => {
        return reject(e);
      });
  })
}

export const requestMfaSetupFinish = async (params: checkMfaDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.post(`http://localhost:3333/mfa/setup/validate`,
      { codeToCheck: params.codeToCheck },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((e) => {
        return reject(e);
      });
  })
}

export const requestMfaSigninInit = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios.post(`http://localhost:3333/mfa/signin/init`,
      {},
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((e) => {
        return reject(e);
      });
  })
}

export const requestMfaSigninFinish = async (params: checkMfaDto) => {
  return new Promise<any>((resolve, reject) => {
    axios.post(`http://localhost:3333/mfa/signin/validate`,
      { codeToCheck: params.codeToCheck },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret.data);
      })
      .catch((e) => {
        return reject(e);
      });
  })
}
