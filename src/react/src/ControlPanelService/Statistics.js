import axios from "axios";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/stats/index.php';

export const getStatisticsList = user => {
  return axios.get(BASE_URL + webApiUri + '?user=' + user);
}