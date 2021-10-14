import axios from "axios";

const deleteAutoUpdateUri = '/delete/cron/autoupdate/';
const addAutoUpdateUri = '/add/cron/autoupdate/';
const webApiUri = '/list/updates/updates.php';
const token = localStorage.getItem("token");
const BASE_URL = window.location.origin;

export const getUpdatesList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, updates) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  updates.forEach(update => {
    formData.append("pkg[]", update);
  });

  return axios.post(BASE_URL + '/bulk/vesta/', formData);
};

export const handleAction = uri => {
  return axios.get(`${BASE_URL}${uri}?token=${token}`);
}

export const enableAutoUpdate = () => {
  return axios.get(`${BASE_URL}${addAutoUpdateUri}?token=${token}`);
};

export const disableAutoUpdate = () => {
  return axios.get(`${BASE_URL}${deleteAutoUpdateUri}?token=${token}`);
};