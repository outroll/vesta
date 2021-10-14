import axios from "axios";

const BASE_URL = window.location.origin;
const webApiUri = '/list/rrd/rrd.php';

export const getRrdList = () => {
  return axios.get(BASE_URL + webApiUri);
}

export function generateImagePath(period, type, rrd) {
  return `/list/rrd/image.php?/rrd/${type}/${period}-${rrd}.png`;
}