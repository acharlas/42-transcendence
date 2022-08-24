import axios from "axios";
const baseUrl = "localhost:3333";

const signin = async (credentials) => {
  const response = await axios.post("http://localhost:3333/auth/signin", {
    email: credentials.email,
    password: credentials.password,
  });
  return response.data.access_token;
};

const signup = async (credentials) => {
  const response = await axios.post("http://localhost:3333/auth/signup", {
    email: credentials.email,
    password: credentials.password,
    username: credentials.username,
  });
  return response.data.access_token;
};

const fortyTwoSign = async (credentials) => {
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
