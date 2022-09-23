import axios from "axios";
import loginService from "../login/login-service";
export interface checkMfaDto { codeToCheck: string; }
export interface activateMfaDto { phoneNumber: string; }

const requestMfaDisable = async () => {
  const response = await axios.delete(
    "http://localhost:3333/mfa/disable",
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } }
  );
  return response;
}

const requestMfaSetupInit = async (params: activateMfaDto) => {
  console.log("requestMfaSetupInit", { params });

  const response = await axios.post(
    "http://localhost:3333/mfa/setup/init",
    { phoneNumber: params.phoneNumber },
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } }
  );
  console.log({ response });
  return response;
}

const requestMfaSetupFinish = async (params: checkMfaDto) => {
  const response = await axios.post(
    "http://localhost:3333/mfa/setup/validate",
    { codeToCheck: params.codeToCheck },
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } }
  );
  console.log({ response });
  return response;
}

const requestMfaSigninInit = async () => {
  const response = await axios.post(
    "http://localhost:3333/mfa/signin/init",
    {},
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } }
  );
  return response;
}

const requestMfaSigninFinish = async (params: checkMfaDto) => {
  const response = await axios.post(
    "http://localhost:3333/mfa/signin/validate",
    { codeToCheck: params.codeToCheck },
    { headers: { Authorization: `Bearer ` + window.sessionStorage.getItem("Token") } }
  );
  return response;
}

const signinWithMfa = async (params: checkMfaDto) => {
  try {
    const response = await requestMfaSigninFinish(params);
    console.log("new token with 2fa");
    window.sessionStorage.setItem("Token", response.data.access_token);
    await loginService.getMe({ token: response.data.access_token });
    return response.data.token;
  }
  catch (e) {
    console.log("Mfa error", { e });
    return e;
  }
}

export default { requestMfaDisable, requestMfaSetupInit, requestMfaSetupFinish, requestMfaSigninInit, requestMfaSigninFinish, signinWithMfa };
