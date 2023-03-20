import axiosMfaAuth from "./axiosInstances/mfaAuthCalls";
import axiosWithAuth from "./axiosInstances/protectedCalls";

export interface checkMfaDto {
  codeToCheck: string;
}

export interface activateMfaDto {
  phoneNumber: string;
}

export const requestMfaDisable = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .delete("/mfa/disable")
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        //console.log('Error in requestMfaDisable', e);
        return reject(e);
      });
  });
};

export const requestMfaSetupInit = async (params: activateMfaDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .post("/mfa/setup/init", { phoneNumber: params.phoneNumber })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        //console.log('Error in requestMfaSetupInit', e);
        return reject(e);
      });
  });
};

export const requestMfaSetupFinish = async (params: checkMfaDto): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosWithAuth
      .post("/mfa/setup/validate", { codeToCheck: params.codeToCheck })
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        //console.log('Error in requestMfaSetupFinish', e);
        return reject(e);
      });
  });
};

export const requestMfaSigninInit = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axiosMfaAuth
      .post("/mfa/signin/init")
      .then((ret) => {
        return resolve(ret);
      })
      .catch((e) => {
        //console.log('Error in requestMfaSigninInit', e);
        return reject(e);
      });
  });
};

export const requestMfaSigninFinish = async (params: checkMfaDto) => {
  return new Promise<any>((resolve, reject) => {
    axiosMfaAuth
      .post("/mfa/signin/validate", { codeToCheck: params.codeToCheck })
      .then((ret) => {
        window.sessionStorage.setItem("AccessToken", ret.data.access_token);
        window.sessionStorage.setItem("RefreshToken", ret.data.refresh_token);
        return resolve(ret);
      })
      .catch((e) => {
        //console.log('Error in requestMfaSigninFinish', e);
        return reject(e);
      });
  });
};
