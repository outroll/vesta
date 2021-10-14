import axios from "axios";

const updateDNSUri = '/api/edit/dns/index.php';
const addDnsApiUri = '/api/add/dns/index.php';
const dNSInfoUri = '/api/edit/dns/index.php';
const token = localStorage.getItem("token");
const BASE_URL = window.location.origin;
const dnsApiUri = '/list/dns/dns.php';

export const getDnsList = () => {
  return axios.get(BASE_URL + dnsApiUri);
}

export const getDNSRecordsList = domain => {
  return axios.get(`${BASE_URL}${dnsApiUri}?domain=${domain}`);
}

export const getDNSRecordInfo = (domain, recordId) => {
  return axios.get(`${BASE_URL}${updateDNSUri}?domain=${domain}&record_id=${recordId}`);
}

export const bulkAction = (action, domainNameSystems) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  domainNameSystems.forEach(domainNameSystem => {
    formData.append("domain[]", domainNameSystem);
  });

  return axios.post(BASE_URL + '/bulk/dns/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
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
      token
    }
  });
}

export const updateDNS = (data, domain) => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + updateDNSUri, formDataObject, {
    params: {
      domain,
      token
    }
  });
}