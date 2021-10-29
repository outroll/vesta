import axios from "axios";
import { getAuthToken } from "src/utils/token";

const BASE_URL = window.location.origin;
const webApiUri = '/api/v1/search/';

export const getSearchResultsList = term => {
  return axios.get(BASE_URL + webApiUri + '?q=' + term);
}

export const handleAction = uri => {
  return axios.get(BASE_URL + uri, {
    params: {
      token: getAuthToken()
    }
  });
}
