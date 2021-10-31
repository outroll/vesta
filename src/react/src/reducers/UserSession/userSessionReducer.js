import { SET_USER_SESSION } from 'src/actions/UserSession/userSessionTypes';

const INITIAL_STATE = {
  session: {}
};

const userSessionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER_SESSION:
      return {
        ...state,
        session: action.value,
      };

    default: return state;
  }
};

export default userSessionReducer;
