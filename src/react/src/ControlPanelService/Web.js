import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const addWebUri = '/api/v1/add/web/index.php';
const webApiUri = '/api/v1/list/web/index.php';
const webStatsUri = '/api/v1/web-stats.php';
const domainInfoUri = '/api/v1/edit/web/index.php';
const generateCSRUri = '/api/v1/generate/ssl/index.php';
const updateDomainUri = '/api/v1/edit/web/index.php';

export const getWebList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, webDomains) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  webDomains.forEach(webDomain => {
    formData.append("domain[]", webDomain);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/web/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addWeb = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addWebUri, formDataObject);
}

export const getWebDomainInfo = domain => {
  return axios.get(BASE_URL + addWebUri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const getWebStats = () => {
  return axios.get(BASE_URL + webStatsUri);
}

export const getDomainInfo = domain => {
  return axios.get(BASE_URL + domainInfoUri, {
    params: {
      domain,
      token: getAuthToken()
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
      token: getAuthToken()
    }
  });
}

export const getCsrInitialData = domain => {
  if (domain) {
    return axios.get(BASE_URL + generateCSRUri, {
      params: {
        domain
      }
    });
  } else {
    return axios.get(BASE_URL + generateCSRUri);
  }
}

export const generateCSR = (data) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + generateCSRUri, formDataObject, {
    params: {
      token: getAuthToken()
    }
  });
}
