import axios from 'axios';

let token = localStorage.getItem('token');
const BASE_URL = window.location.origin;
const usersUri = '/list/user/user.php';
const addUsersUri = '/api/add/user/index.php';
const userInfoUri = '/api/edit/user/index.php';
const updateUserUri = '/api/edit/user/index.php';

export const getUsersList = () => {
  return axios.get(BASE_URL + usersUri);
}

export const bulkAction = (action, selectedUsers) => {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("action", action);

  selectedUsers.forEach(user => {
    formData.append("user[]", user);
  });

  return axios.post(BASE_URL + '/bulk/user/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
}

export const addUser = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  formDataObject.append("token", token);
  formDataObject.append("ok", "Add");

  return axios.post(BASE_URL + addUsersUri, formDataObject);
}

export const getUserInfo = username => {
  return axios.get(BASE_URL + userInfoUri, {
    params: {
      user: username,
      token
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
      token
    }
  });
}