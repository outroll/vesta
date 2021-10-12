import axios from "axios";

const BASE_URL = window.location.origin;
const webApiUri = '/list/log/log.php';

export const getLogsList = () => {
  return axios.get(BASE_URL + webApiUri);
}