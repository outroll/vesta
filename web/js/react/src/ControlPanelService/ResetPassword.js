import axios from "axios";

const BASE_URL = window.location.origin;
const resetPasswordUri = '/api/reset/index.php';

export const resetPassword = (user = '', code = '', password = '', confirmPassword = '') => {
  const formData = new FormData();

  if (password) {
    formData.append('password', password);
  }

  if (confirmPassword) {
    formData.append('password_confirm', confirmPassword);
  }

  if (user) {
    formData.append('user', user);
  }

  if (code) {
    formData.append('code', code);
  }

  return axios.post(BASE_URL + resetPasswordUri, formData);
};
