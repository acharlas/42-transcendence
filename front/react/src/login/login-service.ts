import axios from "axios";
import { checkMfaDto, requestMfaSigninFinish } from "../api/mfa-api";

export interface loginDto {
  username: string;
  password: string;
}

export interface signupDto {
  password: string;
  username: string;
}

export interface fortyTwoLoginDto {
  code: string;
  state: string;
}

export interface getMeDto {
  token: string;
}

const getMe = async (Credential: getMeDto): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    axios
      .get("http://localhost:3333/users/me", {
        headers: {
          Authorization: "Bearer " + Credential.token,
        },
      })
      .then((ret) => {
        sessionStorage.setItem("username", ret.data.username);
        sessionStorage.setItem("nickname", ret.data.nickname);
        sessionStorage.setItem("userid", ret.data.id);
        return resolve();
      })
      .catch((err) => {
        console.log({ err });
        return reject(err);
      });
  });
};

const signin = async (credentials: loginDto) => {
  const response = await axios.post("http://localhost:3333/auth/signin", {
    username: credentials.username,
    password: credentials.password,
  });
  return response.data.access_token;
};

const signup = async (credentials: signupDto) => {
  const response = await axios.post("http://localhost:3333/auth/signup", {
    password: credentials.password,
    username: credentials.username,
  });
  return response.data.access_token;
};

const fortyTwoSign = async (credentials: fortyTwoLoginDto) => {
  try {
    const response = await axios.post("http://localhost:3333/auth/signinApi", {
      code: credentials.code,
      state: credentials.state,
    });
    window.sessionStorage.setItem("Token", response.data.access_token);
    return response;
  } catch (e) {
    console.log("Oauth error", { e });
    return e;
  }
};

export const signinWithMfa = async (params: checkMfaDto) => {
  try {
    const response = await requestMfaSigninFinish(params);
    window.sessionStorage.setItem(`Token`, response.data.access_token);
    return response;
  } catch (e) {
    console.log(`Mfa error`, { e });
    return e;
  }
};

// eslint-disable-next-line
export default { getMe, signup, signin, fortyTwoSign, signinWithMfa };
