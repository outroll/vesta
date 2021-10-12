import axios from "axios";

const token = localStorage.getItem("token");
const BASE_URL = window.location.origin;
const webApiUri = '/list/backup/backup.php';
const scheduleBackupUri = '/schedule/backup/';
const backupDetailsUri = '/list/backup/backup.php';
const backupExclusionsUri = '/api/list/backup/exclusions/index.php';
const backupExclusionsInfoUri = '/api/edit/backup/exclusions/index.php';
const backupRestoreSettingUri = '/api/schedule/restore/index.php';
const bulkRestoreUri = '/api/bulk/restore/index.php';

export const getBackupList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const bulkAction = (action, backups) => {
  const formData = new FormData();
  formData.append("action", action);
  formData.append("token", token);

  backups.forEach(backup => {
    formData.append("backup[]", backup);
    formData.append("delete_url", `/delete/backup/?backup=${backup}&token=${token}`);
  });

  return axios.post(BASE_URL + '/bulk/backup/', formData);
};

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
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
  formData.append("token", token);
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
      token
    }
  });
}
