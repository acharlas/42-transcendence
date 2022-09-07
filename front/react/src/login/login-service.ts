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
  console.log({ credentials });
  try {
    const token = await axios.post("http://localhost:3333/auth/signinApi", {
      code: credentials.code,
      state: credentials.state,
    });
    console.log("Token", { token });
    window.localStorage.setItem("Token", token.data.access_token);
    return token;
  } catch (e) {
    console.log("erreur", { e });
    return e;
  }
};

export default { signup, signin, fortyTwoSign };
