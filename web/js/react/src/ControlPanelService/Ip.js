import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/ip/index.php';
const addIpApiUri = '/api/v1/add/ip/index.php';
const additionalInfoUri = '/api/v1/add/ip/index.php';
const ipInfoUri = '/api/v1/edit/ip/index.php';
const updateIpUri = '/api/v1/edit/ip/index.php';

export const getIpList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, internetProtocols) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  internetProtocols.forEach(internetProtocol => {
    formData.append("ip[]", internetProtocol);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/ip/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const getAdditionalInfo = () => {
  return axios.get(BASE_URL + additionalInfoUri);
}

export const addInternetProtocol = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addIpApiUri, formDataObject);
}

export const getInternetProtocolInfo = ip => {
  return axios.get(BASE_URL + ipInfoUri, {
    params: {
      ip,
      token: getAuthToken()
    }
  });
}

export const updateInternetProtocol = (data, ip) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateIpUri, formDataObject, {
    params: {
      ip,
      token: getAuthToken()
    }
  });
}