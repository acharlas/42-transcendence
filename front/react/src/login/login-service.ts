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

const getMe = async (Credential: getMeDto): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    axios
      .get("http://localhost:3333/users/me", {
        headers: {
          Authorization: "Bearer " + Credential.token,
        },
      })
      .then((ret) => {
        console.log(ret.data.username);
        sessionStorage.setItem("username", ret.data.username);
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
  console.log(response.data.access_token);
  await getMe({ token: response.data.access_token });
  return response.data.access_token;
};

const signup = async (credentials: signupDto) => {
  const response = await axios.post("http://localhost:3333/auth/signup", {
    password: credentials.password,
    username: credentials.username,
  });
  await getMe({ token: response.data.access_token });
  return response.data.access_token;
};

const fortyTwoSign = async (credentials: fortyTwoLoginDto) => {
  console.log({ credentials });
  try {
    const token = await axios.post("http://localhost:3333/auth/signinApi", {
      code: credentials.code,
      state: credentials.state,
    });
    console.log("Token", { token });
    window.sessionStorage.setItem("Token", token.data.access_token);
    await getMe({ token: token.data.access_token });
    return token;
  } catch (e) {
    console.log("erreur", { e });
    return e;
  }
};

export default { signup, signin, fortyTwoSign };
