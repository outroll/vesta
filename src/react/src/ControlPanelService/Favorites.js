import axios from "axios";
let addFavoriteUri = '/api/v1/add/favorite/index.php';
let deleteFavoriteUri = '/api/v1/delete/favorite/index.php';
let BASE_URL = window.location.origin;


export const addFavorite = (unitId, section) => {
  return axios.get(BASE_URL + addFavoriteUri, {
    params: {
      'v_unit_id': unitId,
      'v_section': section
    }
  });
}

export const deleteFavorite = (unitId, section) => {
  return axios.get(BASE_URL + deleteFavoriteUri, {
    params: {
      'v_unit_id': unitId,
      'v_section': section
    }
  });
}