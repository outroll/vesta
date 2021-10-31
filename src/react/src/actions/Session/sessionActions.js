import { LOGIN, LOGOUT, LOGGED_OUT_AS, CHECK_AUTH, RESET_PASSWORD } from './sessionTypes';
import { checkAuth, signIn, signInAs, signOut } from 'src/services/session';
import { resetPassword } from 'src/ControlPanelService/ResetPassword';
import { resetAuthToken, setAuthToken } from 'src/utils/token';
import { REFRESH_COUNTERS } from '../MenuCounters/menuCounterTypes';
import { SET_USER_SESSION } from '../UserSession/userSessionTypes';

const LOGOUT_RESPONSE = 'logged_out';
const LOGOUT_AS_RESPONSE = 'logged_out_as';

export const login = (user, password) => dispatch => {
  return new Promise((resolve, reject) => {
    signIn({ user, password }).then((response) => {
      const { error, session, token, panel, data, user, i18n } = response.data;

      if (token) setAuthToken(token);

      dispatch({
        type: LOGIN,
        value: {
          token: token || '',
          panel,
          i18n: i18n || {},
          userName: user,
          error
        },
      });
      dispatch({
        type: REFRESH_COUNTERS,
        value: {
          user: data,
        }
      });
      dispatch({
        type: SET_USER_SESSION,
        value: session
      });
      resolve(token);
    }, (error) => {
      reject(error);
    });
  });
}

export const reset = ({ user = '', code = '', password = '', password_confirm = '' }) => dispatch => {
  return new Promise((resolve, reject) => {
    resetPassword(user, code, password, password_confirm).then((response) => {
      const { error, session, token, panel, user } = response.data;

      dispatch({
        type: RESET_PASSWORD,
        value: {
          token,
          panel,
          userName: user,
          error
        },
      });
      dispatch({
        type: REFRESH_COUNTERS,
        value: {
          user: {},
        }
      });
      dispatch({
        type: SET_USER_SESSION,
        value: session
      });
      resolve(token);
    }, (error) => {
      reject(error);
    });
  });
}

export const loginAs = username => dispatch => {
  return new Promise((resolve, reject) => {
    signInAs(username).then((response) => {
      const { error, token, session, panel, data, user, i18n } = response.data;
      if (token) setAuthToken(token);

      dispatch({
        type: LOGIN,
        value: {
          userName: user,
          i18n,
          panel,
          token,
          error
        }
      });
      dispatch({
        type: REFRESH_COUNTERS,
        value: {
          user: data,
        }
      });
      dispatch({
        type: SET_USER_SESSION,
        value: session
      });

      resolve(token);
    }, (error) => {
      console.error(error);
      reject();
    });
  });
}

export const logout = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    signOut().then((response) => {
      const { logout_response, error, userName, user, i18n, session, panel } = response.data;

      if (logout_response === LOGOUT_RESPONSE) {
        resetAuthToken();

        dispatch({
          type: LOGOUT,
          value: {
            userName: '',
            token: '',
            panel: {},
            session: {},
            i18n: [],
            error,
          },
        });
        dispatch({
          type: REFRESH_COUNTERS,
          value: {
            user: {},
          }
        });
        dispatch({
          type: SET_USER_SESSION,
          value: {}
        });

        resolve();
      } else if (logout_response === LOGOUT_AS_RESPONSE) {
        dispatch({
          type: LOGGED_OUT_AS,
          value: {
            userName,
            panel,
            token: '',
            i18n,
            error,
          },
        });
        dispatch({
          type: REFRESH_COUNTERS,
          value: {
            user,
          }
        });
        dispatch({
          type: SET_USER_SESSION,
          value: session
        });

        resolve();
      } else {
        resolve(`Error while signing out: ${logout_response}`);
      }
    }, (error) => {
      console.error(error);
      reject();
    });
  });
}

export const checkAuthHandler = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    checkAuth()
      .then(res => {
        const { user, data, session, panel, error, i18n, token } = res.data;

        if (token) setAuthToken(token);

        dispatch({
          type: CHECK_AUTH,
          value: {
            userName: user,
            i18n,
            panel,
            token,
            error
          }
        });
        dispatch({
          type: REFRESH_COUNTERS,
          value: {
            user: data,
          }
        });
        dispatch({
          type: SET_USER_SESSION,
          value: session
        });

        resolve(token);
      })
      .catch(err => {
        reject();
        console.error(err);
      });
  });
}

export const refreshUserSession = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    checkAuth()
      .then(res => {
        const { session, token } = res.data;

        if (token) setAuthToken(token);
        dispatch({
          type: SET_USER_SESSION,
          value: session
        });

        resolve(token);
      })
      .catch(err => {
        reject();
        console.error(err);
      });
  });
}

export const removeToken = () => {
  return {
    type: LOGOUT,
    value: {
      token: '',
      error: ''
    }
  }
}
