import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/server/index.php';
const serverAdditionalInfoUri = '/api/v1/edit/server/index.php';

export const getServersList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, services) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  services.forEach(service => {
    formData.append("service[]", service);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/service/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const getServerAdditionalInfo = () => {
  return axios.get(BASE_URL + serverAdditionalInfoUri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const updateService = (data, uri = '') => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + `/api/v1/edit/server/${uri}/index.php`, formDataObject, {
    params: {
      token: getAuthToken()
    }
  });
}

export const getServiceInfo = service => {
  return axios.get(`${BASE_URL}/api/v1/edit/server/${service}/index.php`);
}

export const getServiceLogs = service => {
  return axios.get(`${BASE_URL}${webApiUri}?${service}`);
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