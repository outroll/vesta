import { LOGGED_OUT_AS, LOGIN, LOGOUT } from '../../actions/Session/sessionTypes';

const INITIAL_STATE = {
  token: '',
  user: {},
  error: '',
  session: {},
  userName: '',
  panel: {}
};

const sessionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.value.token,
        user: action.value.user,
        session: action.value.session,
        userName: action.value.userName,
        panel: action.value.panel,
        error: action.value.error
      };

    case LOGOUT:
      return {
        ...state,
        token: action.value.token,
        user: action.value.user,
        session: action.value.session,
        userName: action.value.userName,
        panel: action.value.panel,
        error: action.value.error
      };

    case LOGGED_OUT_AS:
      return {
        ...state,
        token: action.value.token,
        user: action.value.user,
        session: action.value.session,
        userName: action.value.userName,
        panel: action.value.panel,
        error: action.value.error
      };

    default: return state;
  }
};

export default sessionReducer;
