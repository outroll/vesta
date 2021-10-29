import axios from "axios";
import { getAuthToken } from "src/utils/token";
let BASE_URL = window.location.origin;
let getNotificationsUri = '/api/v1/list/notifications/index.php';
let deleteNotificationsUri = '/api/v1/delete/notification/index.php';

export const getAppNotifications = () => {
  return axios.get(BASE_URL + getNotificationsUri, {
    params: {
      ajax: 1,
      token: getAuthToken()
    }
  });
}

export const deleteNotification = id => {
  return axios.get(BASE_URL + deleteNotificationsUri, {
    params: {
      'delete': 1,
      'notification_id': id,
      token: getAuthToken()
    }
  });
}