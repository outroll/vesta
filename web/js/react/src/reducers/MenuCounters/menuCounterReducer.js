import { REFRESH_COUNTERS } from 'src/actions/MenuCounters/menuCounterTypes';

const INITIAL_STATE = {
  user: {},
};

const menuCounterReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REFRESH_COUNTERS:
      return {
        ...state,
        user: action.value.user,
      };

    default: return state;
  }
};

export default menuCounterReducer;
