import axios from "axios";

export interface checkMfaDto {
  codeToCheck: string;
}

export interface activateMfaDto {
  phoneNumber: string;
}

const requestCheckMfa = async (params: checkMfaDto) => {
  const response = await axios.post("http://localhost:3333/mfa/signin", {
    codeToCheck: params.codeToCheck,
  });
  return response.data.access_token;
  //modify JWT to add that user has validated 2fa?
}

const requestActivateMfa = async (params: activateMfaDto) => {
  const response = await axios.post("http://localhost:3333/mfa/activate", {
    phoneNumber: params.phoneNumber,
  });
  return response;
}

export default { requestCheckMfa, requestActivateMfa };
