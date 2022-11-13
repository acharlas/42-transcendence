import axios from "axios";

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

export const getMe = async (dto: getMeDto): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    axios
      .get("http://localhost:3333/users/me", {
        headers: {
          Authorization: "Bearer " + dto.token,
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

export const signin = async (credentials: loginDto) => {
  const response = await axios.post("http://localhost:3333/auth/signin", {
    username: credentials.username,
    password: credentials.password,
  });
  return response.data.access_token;
}

export const signup = async (credentials: signupDto) => {
  const response = await axios.post("http://localhost:3333/auth/signup", {
    password: credentials.password,
    username: credentials.username,
  });
  return response.data.access_token;
}

export const fortyTwoSign = async (dto: fortyTwoLoginDto) => {
  try {
    const response = await axios.post("http://localhost:3333/auth/signinApi", {
      code: dto.code,
      state: dto.state,
    });
    window.sessionStorage.setItem("Token", response.data.access_token);
    return response;
  } catch (e) {
    console.log("Oauth error", { e });
    return e;
  }
}
