import axios from "axios";

const BASE_URL = window.location.origin;
const userNSApiUri = '/api/list-user-ns.php';

export const getUserNS = () => {
  return axios.get(BASE_URL + userNSApiUri);
}