import axios from "axios";
let BASE_URL = window.location.origin;
let getNotificationsUri = '/list/notifications/?ajax=1';
let deleteNotificationsUri = '/delete/notification';

export const getAppNotifications = () => {
  return axios.get(BASE_URL + getNotificationsUri);
}

export const deleteNotification = id => {
  return axios.get(BASE_URL + deleteNotificationsUri, {
    params: {
      'delete': 1,
      'notification_id': id,
      'token': localStorage.getItem("token")
    }
  });
}