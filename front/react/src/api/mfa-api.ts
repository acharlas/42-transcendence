import customAxios from "./customAxios";

export interface checkMfaDto {
  codeToCheck: string,
}

export interface activateMfaDto {
  phoneNumber: string,
}

export const requestMfaDisable = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.delete(`http://localhost:3333/mfa/disable`,
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in requestMfaDisable", e);
        return reject(e);
      });
  })
}

export const requestMfaSetupInit = async (params: activateMfaDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.post(`http://localhost:3333/mfa/setup/init`,
      { phoneNumber: params.phoneNumber },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in requestMfaSetupInit", e);
        return reject(e);
      });
  })
}

export const requestMfaSetupFinish = async (params: checkMfaDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.post(`http://localhost:3333/mfa/setup/validate`,
      { codeToCheck: params.codeToCheck },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in requestMfaSetupFinish", e);
        return reject(e);
      });
  })
}

export const requestMfaSigninInit = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    customAxios.post(`http://localhost:3333/mfa/signin/init`,
      {},
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in requestMfaSigninInit", e);
        return reject(e);
      });
  })
}

export const requestMfaSigninFinish = async (params: checkMfaDto) => {
  return new Promise<any>((resolve, reject) => {
    customAxios.post(`http://localhost:3333/mfa/signin/validate`,
      { codeToCheck: params.codeToCheck },
      { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        console.log("Error in requestMfaSigninFinish", e);
        return reject(e);
      });
  })
}