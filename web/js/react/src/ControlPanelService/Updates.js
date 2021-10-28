import axios from "axios";
import { getAuthToken } from "src/utils/token";

const deleteAutoUpdateUri = '/api/v1/delete/cron/autoupdate/';
const addAutoUpdateUri = '/api/v1/add/cron/autoupdate/';
const webApiUri = '/api/v1/list/updates/index.php';
const BASE_URL = window.location.origin;

export const getUpdatesList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, updates) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  updates.forEach(update => {
    formData.append("pkg[]", update);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/vesta/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const enableAutoUpdate = () => {
  return axios.get(`${BASE_URL}${addAutoUpdateUri}`, {
    params: {
      token: getAuthToken()
    }
  });
};

export const disableAutoUpdate = () => {
  return axios.get(`${BASE_URL}${deleteAutoUpdateUri}`, {
    params: {
      token: getAuthToken()
    }
  });
};