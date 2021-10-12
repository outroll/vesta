import axios from "axios";

const BASE_URL = window.location.origin;
const webApiUri = '/list/stats/stats.php';

export const getStatisticsList = user => {
  return axios.get(BASE_URL + webApiUri + '?user=' + user);
}