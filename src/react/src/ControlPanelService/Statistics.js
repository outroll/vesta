import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/stats/index.php';

export const getStatisticsList = user => {
  return axios.get(BASE_URL + webApiUri, {
    params: {
      user: user,
      token: getAuthToken()
    }
  });
}