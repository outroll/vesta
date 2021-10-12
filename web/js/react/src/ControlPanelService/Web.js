import axios from "axios";

const token = localStorage.getItem("token");
const BASE_URL = window.location.origin;
const addWebUri = '/api/add/web/index.php';
const webApiUri = '/list/web/web.php';
const webStatsUri = '/api/web-stats.php';
const domainInfoUri = '/api/edit/web/index.php';
const updateDomainUri = '/api/edit/web/index.php';

export const getWebList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, webDomains) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  webDomains.forEach(webDomain => {
    formData.append("domain[]", webDomain);
  });

  return axios.post(BASE_URL + '/bulk/web/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
}

export const addWeb = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addWebUri, formDataObject);
}

export const getWebStats = () => {
  return axios.get(BASE_URL + webStatsUri);
}

export const getDomainInfo = domain => {
  return axios.get(BASE_URL + domainInfoUri, {
    params: {
      domain,
      token
    }
  });
}

export const updateWebDomain = (data, domain) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateDomainUri, formDataObject, {
    params: {
      domain,
      token
    }
  });
}