import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;

export const getWebLogs = uri => {
  const separator = uri.includes('?') ? '&' : '?';
  return axios.get(BASE_URL + '/api/v1' + uri + separator + 'token=' + getAuthToken());
}