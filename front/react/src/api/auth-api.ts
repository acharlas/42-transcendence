import axiosWithAuth from './axiosInstances/protectedCalls';
import axiosNoAuth from './axiosInstances/unprotectedCalls';

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

export const getMe = async (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    axiosWithAuth
      .get('/users/me')
      .then((ret) => {
        sessionStorage.setItem('username', ret.data.username);
        sessionStorage.setItem('nickname', ret.data.nickname);
        sessionStorage.setItem('userid', ret.data.id);
        return resolve();
      })
      .catch((err) => {
        console.log({ err });
        return reject(err);
      });
  });
};

export const signin = async (credentials: loginDto) => {
  const response = await axiosNoAuth.post('/auth/signin', {
    username: credentials.username,
    password: credentials.password,
  });
  window.sessionStorage.setItem('AccessToken', response.data.access_token);
  window.sessionStorage.setItem('RefreshToken', response.data.refresh_token);
  return response.data.access_token;
};

export const signup = async (credentials: signupDto) => {
  const response = await axiosNoAuth.post('/auth/signup', {
    password: credentials.password,
    username: credentials.username,
  });
  window.sessionStorage.setItem('AccessToken', response.data.access_token);
  window.sessionStorage.setItem('RefreshToken', response.data.refresh_token);
  return response.data.access_token;
};

export const fortyTwoSign = async (dto: fortyTwoLoginDto) => {
  try {
    const response = await axiosNoAuth.post('/auth/signinApi', {
      code: dto.code,
      state: dto.state,
    });
    window.sessionStorage.setItem('AccessToken', response.data.access_token);
    window.sessionStorage.setItem('RefreshToken', response.data.refresh_token);
    return response;
  } catch (e) {
    console.log('Oauth error', e);
    return e;
  }
};
