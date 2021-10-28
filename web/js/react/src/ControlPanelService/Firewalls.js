import axios from 'axios';
import { getAuthToken } from 'src/utils/token';

const BASE_URL = window.location.origin;
const usersUri = '/api/v1/list/firewall/index.php';
const addFirewallUri = '/api/v1/add/firewall/index.php';
const firewallInfoUri = '/api/v1/edit/firewall/index.php';
const updateFirewallUri = '/api/v1/edit/firewall/index.php';
const addBanIpsUri = '/api/v1/add/firewall/banlist/index.php';
const banListUri = '/api/v1/list/firewall/banlist/index.php';

export const getFirewallList = () => {
  return axios.get(BASE_URL + usersUri);
}

export const getBanList = () => {
  return axios.get(BASE_URL + banListUri);
}

export const bulkAction = (action, ips, banIps) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  ips.forEach(ip => {
    const banIp = banIps.find(banIp => banIp.NAME === ip);
    formData.append("ipchain[]", `${ip}:${banIp['CHAIN']}`);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/firewall/banlist/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const getBanIps = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.get(BASE_URL + addBanIpsUri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addBanIp = (data) => {
  let formDataObject = new FormData();

  formDataObject.append('token', getAuthToken());

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addBanIpsUri, formDataObject, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addFirewall = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addFirewallUri, formDataObject);
}

export const getFirewallInfo = rule => {
  return axios.get(BASE_URL + firewallInfoUri, {
    params: {
      rule,
      token: getAuthToken()
    }
  });
}

export const updateFirewall = (data, rule) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateFirewallUri, formDataObject, {
    params: {
      rule,
      token: getAuthToken()
    }
  });
}