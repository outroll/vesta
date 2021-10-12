import axios from "axios";

const BASE_URL = window.location.origin;
const webApiUri = '/search/search.php';

export const getSearchResultsList = term => {
  return axios.get(BASE_URL + webApiUri + '?q=' + term);
}

export const handleAction = uri => {
  return axios.get(BASE_URL + uri);
}