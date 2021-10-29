import { ADD_NOTIFICATIONS, REMOVE_NOTIFICATIONS } from './notificationTypes';

export const addNotifications = value => {
  return {
    type: ADD_NOTIFICATIONS,
    value
  };
};

export const removeNotifications = () => {
  return {
    type: REMOVE_NOTIFICATIONS,
    value: []
  };
};
