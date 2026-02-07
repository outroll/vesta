import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/list/rrd/index.php';

export const getRrdList = () => {
  return axios.get(BASE_URL + webApiUri, {
    params: {
      token: getAuthToken()
    }
  });
}

export function generateImagePath(period, type, rrd) {
  return `/api/v1/list/rrd/image.php?/rrd/${type}/${period}-${rrd}.png`;
}
