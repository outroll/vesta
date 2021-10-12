import axios from "axios";

const BASE_URL = window.location.origin;
const token = localStorage.getItem("token");
const webApiUri = '/list/package/package.php';
const additionalPackageInfoUri = '/api/add/package/index.php';
const addPackageUri = '/api/add/package/index.php';
const packageInfoUri = '/api/edit/package/index.php';
const updatePackageUri = '/api/edit/package/index.php';

export const getPackageList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, backups) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  backups.forEach(backup => {
    formData.append("package[]", backup);
    formData.append("delete_url", `/delete/package/?package=${backup}&token=${token}`);
  });

  return axios.post(BASE_URL + '/bulk/package/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
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
      token
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
