import axios from 'axios';

const BASE_URL = window.location.origin;
const token = localStorage.getItem("token");
const usersUri = '/list/firewall/firewall.php';
const addFirewallUri = '/api/add/firewall/index.php';
const firewallInfoUri = '/api/edit/firewall/index.php';
const updateFirewallUri = '/api/edit/firewall/index.php';
const addBanIpsUri = '/api/add/firewall/banlist/index.php';
const banListUri = '/list/firewall/banlist/banlist.php';

export const getFirewallList = () => {
  return axios.get(BASE_URL + usersUri);
}

export const getBanList = () => {
  return axios.get(BASE_URL + banListUri);
}

export const bulkAction = (action, firewalls) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  firewalls.forEach(firewall => {
    formData.append("rule[]", firewall);
  });

  return axios.post(BASE_URL + '/bulk/firewall/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
}

export const getBanIps = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.get(BASE_URL + addBanIpsUri, {
    params: {
      token
    }
  });
}

export const addBanIp = (data) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.get(BASE_URL + addBanIpsUri, {
    params: {
      token
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
      token
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
      token
    }
  });
}