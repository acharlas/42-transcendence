import axios from "axios";

export interface checkMfaDto {
  codeToCheck: string;
}

export interface activateMfaDto {
  phoneNumber: string;
}

const requestDisableMfa = async (params: activateMfaDto) => {
  const response = await axios.post("http://localhost:3333/mfa/disable");
  return response;
}

const requestInitSetupMfa = async (params: activateMfaDto) => {
  const response = await axios.post("http://localhost:3333/mfa/init-setup", {
    phoneNumber: params.phoneNumber,
  });
  return response;
}

const requestFinishSetupMfa = async (params: checkMfaDto) => {
  const response = await axios.post("http://localhost:3333/mfa/finish-setup", {
    codeToCheck: params.codeToCheck,
  });
  return response;
}

const requestCheckMfa = async (params: checkMfaDto) => {
  const response = await axios.post("http://localhost:3333/mfa/signin", {
    codeToCheck: params.codeToCheck,
  });
  return response.data.access_token;
}

export default { requestDisableMfa, requestInitSetupMfa, requestFinishSetupMfa, requestCheckMfa };
