import axios from "axios";

const webApiUri = '/api/v1/languages.php';
const BASE_URL = window.location.origin;

export const getLanguages = () => {
  return axios.get(BASE_URL + webApiUri);
}

export const languagesMock = [
  "ar",
  "az",
  "bg",
  "bs",
  "cn",
  "cz",
  "da",
  "de",
  "el",
  "en",
  "es",
  "fa",
  "fi",
  "fr",
  "hu",
  "id",
  "it",
  "ja",
  "ka",
  "ko",
  "nl",
  "no",
  "pl",
  "pt-BR",
  "pt",
  "ro",
  "ru",
  "se",
  "sr",
  "th",
  "tr",
  "tw",
  "ua",
  "ur",
  "vi"
];