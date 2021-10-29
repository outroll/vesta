import axios from "axios";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/log/index.php';

export const getLogsList = () => {
  return axios.get(BASE_URL + webApiUri);
}