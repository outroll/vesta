import axios from "axios";

const BASE_URL = window.location.origin;
const token = localStorage.getItem("token");
const webApiUri = '/list/server/server.php';
const serverAdditionalInfoUri = '/api/edit/server/index.php';

export const getServersList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, services) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  services.forEach(service => {
    formData.append("service[]", service);
  });

  return axios.post(BASE_URL + '/api/bulk/service/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
}

export const getServerAdditionalInfo = () => {
  return axios.get(BASE_URL + serverAdditionalInfoUri, {
    params: {
      token
    }
  });
}

export const updateService = (data, uri = '') => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + `/api/edit/server/${uri}/index.php`, formDataObject, {
    params: {
      token
    }
  });
}

export const getServiceInfo = service => {
  return axios.get(`${BASE_URL}/api/edit/server/${service}/index.php`);
}

export const getServiceLogs = service => {
  return axios.get(`${BASE_URL}/list/server/server.php?${service}`);
}

export const services = [
  'apache2',
  'clamd',
  'cron',
  'crond',
  'exim',
  'exim4',
  'fail2ban',
  'iptables',
  'mariadb',
  'mysqld',
  'named',
  'php-fpm',
  'php5-fpm',
  'proftpd',
  'spamassassin',
  'spamd',
  'vsftpd',
];