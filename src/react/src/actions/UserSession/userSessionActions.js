import { SET_USER_SESSION } from './userSessionTypes';

export const setUserSession = value => {
  return {
    type: SET_USER_SESSION,
    value
  };
};
