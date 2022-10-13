import loginService from "../login/login-service";
import { requestMfaSigninFinish, checkMfaDto } from "../api/mfa-api"

export const signinWithMfa = async (params: checkMfaDto) => {
  try {
    const response = await requestMfaSigninFinish(params);
    window.sessionStorage.setItem(`Token`, response.data.access_token);
    await loginService.getMe({ token: response.data.access_token });
    return response.data.token;
  }
  catch (e) {
    console.log(`Mfa error`, { e });
    return e;
  }
}
