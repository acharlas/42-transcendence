import axios from "axios";
const baseUrl = "localhost:3333";

const login = async (credentials) => {
  const response = await axios.post("http://localhost:3333/auth/signin", {
    email: credentials.email,
    password: credentials.password,
  });
  return response.data.access_token;
};

export default { login };
