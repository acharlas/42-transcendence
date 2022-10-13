import axios from "axios";

export interface checkMfaDto {
  codeToCheck: string,
}

export interface activateMfaDto {
  phoneNumber: string,
}

export const requestMfaDisable = async () => {
  const response = await axios.delete(`http://localhost:3333/mfa/disable`,
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } }
  );
  return response;
}

export const requestMfaSetupInit = async (params: activateMfaDto) => {
  const response = await axios.post(`http://localhost:3333/mfa/setup/init`,
    { phoneNumber: params.phoneNumber },
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } }
  );
  return response;
}

export const requestMfaSetupFinish = async (params: checkMfaDto) => {
  const response = await axios.post(`http://localhost:3333/mfa/setup/validate`,
    { codeToCheck: params.codeToCheck },
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } }
  );
  return response;
}

export const requestMfaSigninInit = async () => {
  const response = await axios.post(`http://localhost:3333/mfa/signin/init`,
    {},
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } }
  );
  return response;
}

export const requestMfaSigninFinish = async (params: checkMfaDto) => {
  const response = await axios.post(`http://localhost:3333/mfa/signin/validate`,
    { codeToCheck: params.codeToCheck },
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem(`Token`) } }
  );
  return response;
}
