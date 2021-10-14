import axios from "axios";

const BASE_URL = window.location.origin;

export const getWebLogs = uri => {
  return axios.get(BASE_URL + uri);
}