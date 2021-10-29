import axios from "axios";
import { getAuthToken } from "src/utils/token";

const updateDNSUri = '/api/v1/edit/dns/index.php';
const addDnsApiUri = '/api/v1/add/dns/index.php';
const dNSInfoUri = '/api/v1/edit/dns/index.php';
const BASE_URL = window.location.origin;
const dnsApiUri = '/api/v1/list/dns/index.php';

export const getDnsList = () => {
  return axios.get(BASE_URL + dnsApiUri);
}

export const getDNSRecordsList = domain => {
  return axios.get(`${BASE_URL}${dnsApiUri}?domain=${domain}`);
}

export const getDNSRecordInfo = (domain, recordId) => {
  return axios.get(`${BASE_URL}${updateDNSUri}?domain=${domain}&record_id=${recordId}`);
}

export const bulkDomainAction = (action, domains) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  domains.forEach(record => {
    formData.append("domain[]", record);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/dns/', formData);
};

export const bulkAction = (action, records, domain) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());
  formData.append("domain", domain);

  records.forEach(record => {
    formData.append("record[]", record);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/dns/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const addDomainNameSystem = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addDnsApiUri, formDataObject);
}

export const addDomainNameSystemRecord = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + addDnsApiUri, formDataObject);
}

export const getDNSInfo = domain => {
  return axios.get(BASE_URL + dNSInfoUri, {
    params: {
      domain,
      token: getAuthToken()
    }
  });
}

export const updateDNS = (data, domain, recordId) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateDNSUri, formDataObject, {
    params: {
      domain,
      record_id: recordId,
      token: getAuthToken()
    }
  });
}