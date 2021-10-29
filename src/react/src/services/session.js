import axios from 'axios';
import { getAuthToken } from 'src/utils/token';

const BASE_URL = window.location.origin;

export const signIn = (data) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  formDataObject.append("token", getAuthToken());

  return axios.post(`${BASE_URL}/api/v1/login/index.php`, formDataObject);
};

export const checkAuth = () => {
  let uri = '/api/v1/login/index.php';
  const token = getAuthToken();

  if (token) uri += `?token=${token}`;

  return axios.get(`${BASE_URL}${uri}`);
};

export const signInAs = (username) => {
  return axios.get(`${BASE_URL}/api/v1/login/index.php`, {
    params: {
      loginas: username,
      token: getAuthToken()
    }
  });
};

export const signOut = () => {
  return axios.get(`${BASE_URL}/api/v1/logout/index.php`);
};

export const getMainData = () => {
  let uri = `${BASE_URL}/api/v1/login/session.php`;

  return axios.get(uri);
};

export const checkAuthToken = token => {
  let uri = `${BASE_URL}/api/v1/login/session.php`;

  if (token) uri += `?token=${token}`;

  return axios.get(uri);
};
