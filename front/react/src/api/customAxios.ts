import axios from "axios";

// const responseHandler = response => {
//   console.log(response);
//   return response;
// };

const errorHandler = (error) => {
  // console.log(error);
  if (error?.response?.status === 401) {
    if (error?.response?.data?.message === "2FA required") {
      console.log("Missing 2fa: redirecting to 2fa page.");
      window.location.href = "/mfa-signin";
    } else {
      console.log("No auth: redirecting to login page.");
      window.location.href = "/";
    }
  }
  return Promise.reject(error);
};

axios.interceptors.response.use(
  //(response) => responseHandler(response),
  (error) => errorHandler(error)
);

export default axios.create({});
