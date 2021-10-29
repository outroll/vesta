import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/backup/index.php';
const scheduleBackupUri = '/api/v1/schedule/restore/';
const backupDetailsUri = '/api/v1/list/backup/index.php';
const backupExclusionsUri = '/api/v1/list/backup/exclusions/index.php';
const backupExclusionsInfoUri = '/api/v1/edit/backup/exclusions/index.php';
const backupRestoreSettingUri = '/api/v1/schedule/restore/index.php';
const bulkRestoreUri = '/api/v1/bulk/restore/index.php';

export const getBackupList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, backups) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", getAuthToken());

  backups.forEach(backup => {
    formData.append("backup[]", backup);
  });

  return axios.post(BASE_URL + '/api/v1/bulk/backup/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}

export const scheduleBackup = () => {
  return axios.get(BASE_URL + scheduleBackupUri);
}

export const getBackupDetails = backup => {
  return axios.get(BASE_URL + `${backupDetailsUri}?backup=${backup}`);
}

export const restoreBackupSetting = params => {
  return axios.get(BASE_URL + `${backupRestoreSettingUri}${params}`);
}

export const bulkRestore = (action, selection, backup) => {
  const formData = new FormData();
  formData.append("token", getAuthToken());
  formData.append("action", action);
  formData.append("backup", backup);

  selection.forEach(udir => {
    formData.append("udir[]", udir);
  });

  return axios.post(BASE_URL + `${bulkRestoreUri}`, formData);
}

export const getBackupExclusions = () => {
  return axios.get(BASE_URL + `${backupExclusionsUri}`);
}

export const getBackupExclusionsInfo = () => {
  return axios.get(BASE_URL + `${backupExclusionsInfoUri}`);
}

export const updateBackupExclusions = data => {
  let formDataObject = new FormData();

  for (let key in data) {
    formDataObject.append(key, data[key]);
  }

  return axios.post(BASE_URL + backupExclusionsInfoUri, formDataObject, {
    params: {
      token: getAuthToken()
    }
  });
}
