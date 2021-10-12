import { LOGIN, LOGOUT, LOGGED_OUT_AS, RESET_PASSWORD } from './sessionTypes';
import { checkAuth, signIn, signInAs, signOut } from 'src/services/session';
import { resetAuthToken, setAuthToken } from 'src/utils/token';
import { resetPassword } from 'src/ControlPanelService/ResetPassword';

const LOGOUT_RESPONSE = 'logged_out';
const LOGOUT_AS_RESPONSE = 'logged_out_as';

export const login = (user, password) => dispatch => {
  return new Promise((resolve, reject) => {
    signIn(user, password).then((response) => {
      const { error, session, token, panel, data, user } = response.data;
      if (token) setAuthToken(token);

      dispatch({
        type: LOGIN,
        value: {
          token: data ? token : '',
          panel,
          session,
          userName: user,
          user: data,
          error
        },
      });
      resolve(response.data);
    }, (error) => {
      reject(error);
    });
  });
}

export const reset = ({ user = '', code = '', password = '', password_confirm = '' }) => dispatch => {
  return new Promise((resolve, reject) => {
    resetPassword(user, code, password, password_confirm).then((response) => {
      const { error, session, token, panel, user } = response.data;
      if (token) setAuthToken(token);

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
      resolve(response.data);
    }, (error) => {
      reject(error);
    });
  });
}

export const loginAs = username => dispatch => {
  return new Promise((resolve, reject) => {
    signInAs(username).then((response) => {
      const { error, token, session, panel, data, user } = response.data;
      if (token) setAuthToken(token);

      dispatch({
        type: LOGIN,
        value: {
          token,
          panel,
          session,
          userName: user,
          user: data,
          error,
        },
      });

      resolve(response.data);
    }, (error) => {
      console.error(error);
      reject();
    });
  });
}

export const logout = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    signOut().then((response) => {
      const { logout_response, panel, session, user, data, token } = response.data;

      if (logout_response === LOGOUT_RESPONSE) {
        resetAuthToken();

        dispatch({
          type: LOGOUT,
          value: {
            userName: user,
            user: {},
            token,
            panel,
            session,
            error: ''
          },
        });

        resolve();
      } else if (logout_response === LOGOUT_AS_RESPONSE) {
        const { token } = getState().session;
        dispatch({
          type: LOGGED_OUT_AS,
          value: {
            userName: user,
            user: data,
            session,
            panel,
            token,
            error: ''
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

export const setToken = (token) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    checkAuth(token)
      .then(res => {
        const { user, data, session, panel, error } = res.data;

        dispatch({
          type: LOGIN,
          value: {
            userName: user,
            user: data,
            session,
            panel,
            token,
            error
          }
        });

        resolve();
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
