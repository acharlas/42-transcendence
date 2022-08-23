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
  return new Promise((resolve, reject) => {
    console.log({ credentials });
    axios
      .post("http://localhost:3333/auth/signinApi", {
        code: credentials.code,
        state: credentials.state,
      })
      .then((ret) => {
        console.log({ ret });
        return resolve(ret);
      })
      .catch((err) => {
        console.log({ err });
        return reject(err);
      });
  });
};

export default { signup, signin, fortyTwoSign };
