import axios from "axios";

const token = localStorage.getItem("token");
const { i18n } = window.GLOBAL.App;
const BASE_URL = window.location.origin;
const webApiUri = '/list/mail/mail.php';
const addMailApiUri = '/api/add/mail/index.php';
const mailInfoUri = '/api/edit/mail/index.php';
const updateMailUri = '/api/edit/mail/index.php';

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
  formData.append("token", token);

  domainNameSystems.forEach(domainNameSystem => {
    formData.append("domain[]", domainNameSystem);
  });

  return axios.post(BASE_URL + '/bulk/mail/', formData);
};

export const bulkMailAccountAction = (action, domain, accounts = []) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);
  formData.append("domain", domain);

  accounts.forEach(account => {
    formData.append("account[]", account);
  });

  return axios.post(BASE_URL + '/bulk/mail/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
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
      token
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
      token
    }
  });
}

export const mailInfoBlockSelectOptions = [
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