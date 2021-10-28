import { LOGGED_OUT_AS, LOGIN, LOGOUT, CHECK_AUTH } from '../../actions/Session/sessionTypes';

const INITIAL_STATE = {
  token: '',
  error: '',
  session: {},
  i18n: {},
  userName: '',
  panel: {}
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.value.token,
        session: action.value.session,
        userName: action.value.userName,
        i18n: action.value.i18n || {},
        panel: action.value.panel,
        error: action.value.error
      };

    case LOGOUT:
      return {
        ...state,
        token: action.value.token,
        session: action.value.session,
        userName: action.value.userName,
        i18n: action.value.i18n || {},
        panel: action.value.panel,
        error: action.value.error
      };

    case LOGGED_OUT_AS:
      return {
        ...state,
        token: action.value.token,
        session: action.value.session,
        userName: action.value.userName,
        i18n: action.value.i18n || {},
        panel: action.value.panel,
        error: action.value.error
      };

    case CHECK_AUTH: return {
      ...state,
      token: action.value.token,
      session: action.value.session,
      userName: action.value.userName,
      i18n: action.value.i18n || {},
      panel: action.value.panel,
      error: action.value.error
    };

    default: return state;
  }
};

export default sessionReducer;
