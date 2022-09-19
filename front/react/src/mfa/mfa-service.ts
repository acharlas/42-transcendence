import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:3333/'
// axios.defaults.headers.common = {'Authorization': `bearer ${token}`}

export interface checkMfaDto { codeToCheck: string; }
export interface activateMfaDto { phoneNumber: string; }

const requestMfaDisable = async (params: activateMfaDto) => {
  const axiosUrl = "http://localhost:3333/mfa/disable";
  const axiosBody = {};
  const axiosConfig = {
    headers: { Authorization: `Bearer ` + window.localStorage.getItem("Token") }
  };
  const response = await axios.post(axiosUrl, axiosBody, axiosConfig);
  return response;
}

const requestMfaSetupInit = async (params: activateMfaDto) => {
  const axiosUrl = "http://localhost:3333/mfa/setup/init";
  const axiosBody = { phoneNumber: params.phoneNumber };
  const axiosConfig = {
    headers: { Authorization: `Bearer ` + window.localStorage.getItem("Token") }
  };
  const response = await axios.post(axiosUrl, axiosBody, axiosConfig);
  return response;
}

const requestMfaSetupFinish = async (params: checkMfaDto) => {
  const axiosUrl = "http://localhost:3333/mfa/setup/validate";
  const axiosBody = { codeToCheck: params.codeToCheck };
  const axiosConfig = {
    headers: { Authorization: `Bearer ` + window.localStorage.getItem("Token") }
  };
  const response = await axios.post(axiosUrl, axiosBody, axiosConfig);
  return response;
}

const requestMfaSigninInit = async () => {
  const response = await axios.post("http://localhost:3333/mfa/signin/init", {});
  return response;
}

const requestMfaSigninFinish = async (params: checkMfaDto) => {
  const response = await axios.post("http://localhost:3333/mfa/signin/validate", {
    codeToCheck: params.codeToCheck,
  });
  return response;
}

export default { requestMfaDisable, requestMfaSetupInit, requestMfaSetupFinish, requestMfaSigninInit, requestMfaSigninFinish };
