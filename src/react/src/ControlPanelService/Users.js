import axios from 'axios';
import { getAuthToken } from 'src/utils/token';

const BASE_URL = window.location.origin;
const usersUri = '/api/v1/list/user/index.php';
const addUsersUri = '/api/v1/add/user/index.php';
const userInfoUri = '/api/v1/edit/user/index.php';
const updateUserUri = '/api/v1/edit/user/index.php';

export const getUsersList = () => {
  return axios.get(BASE_URL + usersUri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const bulkAction = (action, selectedUsers) => {
  const formData = new FormData();
  formData.append("token", getAuthToken());
  formData.append("action", action);

  selectedUsers.forEach(user => {
    formData.append("user[]", user);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/user/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addUser = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  formDataObject.append("token", getAuthToken());
  formDataObject.append("ok", "Add");

  return axios.post(BASE_URL + addUsersUri, formDataObject);
}

export const getUserInfo = username => {
  return axios.get(BASE_URL + userInfoUri, {
    params: {
      user: username,
      token: getAuthToken()
    }
  });
}

export const updateUser = (data, user) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateUserUri, formDataObject, {
    params: {
      user,
      token: getAuthToken()
    }
  });
}
