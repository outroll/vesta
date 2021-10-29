import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/mail/index.php';
const addMailApiUri = '/api/v1/add/mail/index.php';
const mailInfoUri = '/api/v1/edit/mail/index.php';
const updateMailUri = '/api/v1/edit/mail/index.php';

export const getMailList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const getMailAccountList = domain => {
  return axios.get(`${BASE_URL}${webApiUri}?domain=${domain}`)
}

export const getMailAccountInfo = (domain, account) => {
  return axios.get(`${BASE_URL}${mailInfoUri}?domain=${domain}&account=${account}`)
}

export const bulkAction = (action, domainNameSystems) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  domainNameSystems.forEach(domainNameSystem => {
    formData.append("domain[]", domainNameSystem);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/mail/', formData);
};

export const bulkMailAccountAction = (action, domain, accounts = []) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());
  formData.append("domain", domain);

  accounts.forEach(account => {
    formData.append("account[]", account);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/mail/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addMail = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addMailApiUri, formDataObject);
}

export const addMailAccount = (data, domain) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(`${BASE_URL}${addMailApiUri}?domain=${domain}`, formDataObject);
}

export const editMailAccount = (data, domain, account) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(`${BASE_URL}${updateMailUri}?domain=${domain}&account=${account}`, formDataObject);
}

export const getMailInfo = domain => {
  return axios.get(BASE_URL + mailInfoUri, {
    params: {
      domain,
      token: getAuthToken()
    }
  });
}

export const updateMail = (data, domain) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateMailUri, formDataObject, {
    params: {
      domain,
      token: getAuthToken()
    }
  });
}

export const mailInfoBlockSelectOptions = i18n => [
  {
    value: i18n['Use server hostname'],
    type: 'hostname',
  },
  {
    value: i18n['Use domain hostname'],
    type: 'domain',
  },
  {
    value: i18n['Use STARTTLS'],
    type: 'starttls',
  },
  {
    value: i18n['Use SSL / TLS'],
    type: 'ssl',
  },
  {
    value: i18n['No encryption'],
    type: 'no_encryption',
  }
];