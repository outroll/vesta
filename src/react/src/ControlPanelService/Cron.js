import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/cron/index.php';
const cronAddApiUri = '/api/v1/add/cron/index.php';
const jobInfoUri = '/api/v1/edit/cron/index.php';
const updateCronJobUri = '/api/v1/edit/cron/index.php';

export const getCronList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, domainNameSystems) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  domainNameSystems.forEach(domainNameSystem => {
    formData.append("job[]", domainNameSystem);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/cron/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addCronJob = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + cronAddApiUri, formDataObject);
}

export const getCronJobInfo = job => {
  return axios.get(BASE_URL + jobInfoUri, {
    params: {
      job,
      token: getAuthToken()
    }
  });
}

export const updateCronJob = (data, job) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateCronJobUri, formDataObject, {
    params: {
      job,
      token: getAuthToken()
    }
  });
}