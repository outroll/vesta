import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/package/index.php';
const additionalPackageInfoUri = '/api/v1/add/package/index.php';
const addPackageUri = '/api/v1/add/package/index.php';
const packageInfoUri = '/api/v1/edit/package/index.php';
const updatePackageUri = '/api/v1/edit/package/index.php';

export const getPackageList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, backups) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  backups.forEach(backup => {
    formData.append("package[]", backup);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/package/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addPackage = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addPackageUri, formDataObject);
}

export const getAdditionalPackageInfo = () => {
  return axios.get(BASE_URL + additionalPackageInfoUri);
}

export const getPackageInfo = item => {
  return axios.get(BASE_URL + packageInfoUri, {
    params: {
      package: item,
      token: getAuthToken()
    }
  });
}

export const updatePackage = (data, item) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updatePackageUri, formDataObject, {
    params: {
      package: item
    }
  });
}
