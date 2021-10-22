import { LOGIN, LOGOUT, LOGGED_OUT_AS, CHECK_AUTH, RESET_PASSWORD } from './sessionTypes';
import { checkAuth, signIn, signInAs, signOut } from 'src/services/session';
import { resetPassword } from 'src/ControlPanelService/ResetPassword';
import { resetAuthToken, setAuthToken } from 'src/utils/token';

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
          session,
          i18n: i18n || {},
          userName: user,
          user: data,
          error
        },
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
          session,
          userName: user,
          user: {},
          error
        },
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
          user: data,
          i18n,
          session,
          panel,
          token,
          error
        }
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
            user: {},
            token: '',
            panel: {},
            session: {},
            i18n: [],
            error,
          },
        });

        resolve();
      } else if (logout_response === LOGOUT_AS_RESPONSE) {
        dispatch({
          type: LOGGED_OUT_AS,
          value: {
            userName,
            user,
            session,
            panel,
            token: '',
            i18n,
            error,
          },
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

        dispatch({
          type: CHECK_AUTH,
          value: {
            userName: user,
            user: data,
            i18n,
            session,
            panel,
            token,
            error
          }
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
