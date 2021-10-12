import axios from 'axios';

const BASE_URL = window.location.origin;

export const signIn = (user, password) => {
  return axios.post(`${BASE_URL}/api/login/index.php`, {
    user,
    password,
  });
};

export const signInAs = (username) => {
  return axios.get(`${BASE_URL}/api/login/index.php`, {
    params: {
      loginas: username
    }
  });
};

export const signOut = () => {
  return axios.get(`${BASE_URL}/api/logout/index.php`);
};

export const checkAuth = token => {
  return axios.get(`${BASE_URL}/api/login/session.php?token=${token}`);
};
