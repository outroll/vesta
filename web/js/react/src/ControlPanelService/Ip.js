import axios from "axios";

const token = localStorage.getItem("token");
const BASE_URL = window.location.origin;
const webApiUri = '/list/ip/ip.php';
const addIpApiUri = '/api/add/ip/index.php';
const additionalInfoUri = '/api/add/ip/index.php';
const ipInfoUri = '/api/edit/ip/index.php';
const updateIpUri = '/api/edit/ip/index.php';

export const getIpList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, internetProtocols) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  internetProtocols.forEach(internetProtocol => {
    formData.append("ip[]", internetProtocol);
    formData.append("delete_url", `/delete/ip/?ip=${internetProtocol}&token=${token}`);
  });

  return axios.post(BASE_URL + '/bulk/ip/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
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
      token
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
      token
    }
  });
}