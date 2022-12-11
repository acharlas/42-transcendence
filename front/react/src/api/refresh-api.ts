import axios from 'axios';
//used by custom axios but we use base axios instances here

export const refreshTokens = async (): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get('http://localhost:3333/auth/refresh', {
        headers: {
          Authorization:
            'Bearer ' + window.sessionStorage.getItem('RefreshToken'),
        },
      })
      .then((r) => {
        // console.log('Old tokens:');
        // console.log(window.sessionStorage.getItem('AccessToken'));
        // console.log(window.sessionStorage.getItem('RefreshToken'));
        window.sessionStorage.setItem('AccessToken', r.data.access_token);
        window.sessionStorage.setItem('RefreshToken', r.data.refresh_token);
        // console.log('New tokens:');
        // console.log(window.sessionStorage.getItem('AccessToken'));
        // console.log(window.sessionStorage.getItem('RefreshToken'));
        return resolve(r);
      })
      .catch((e) => {
        console.log('Error in refreshTokens', e);
        return reject(e);
      });
  });
};
