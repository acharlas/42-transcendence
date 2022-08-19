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

const fortytwoSignup = async () => {
  let ungessable = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%";
  const stringLength = Math.floor(Math.random() * 20);
  let url =
    "https://api.intra.42.fr/oauth/authorize?client_id=cc0a3271ddce31f6d121cb5a2a3489ca4200861da7da4a721eba8b5cf1c00ee2&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2F&response_type=code";

  for (let i = 0; i < stringLength; i++) {
    ungessable += possible.at(Math.floor(Math.random() * possible.length));
  }

  //url += "&scope=public&state=" + ungessable;

  try {
    const response = await axios.get(url);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export default { signup, signin, fortytwoSignup };
