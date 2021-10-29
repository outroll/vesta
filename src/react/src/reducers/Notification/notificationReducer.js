import { ADD_NOTIFICATIONS, REMOVE_NOTIFICATIONS } from 'src/actions/Notification/notificationTypes';

const INITIAL_STATE = {
  notifications: null
};

const notificationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.value,
      };

    case REMOVE_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.value,
      };

    default: return state;
  }
};

export default notificationReducer;
