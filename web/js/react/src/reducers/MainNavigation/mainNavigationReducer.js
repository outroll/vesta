import { ADD_FOCUSED_ELEMENT, ADD_ACTIVE_ELEMENT, REMOVE_ACTIVE_ELEMENT, REMOVE_FOCUSED_ELEMENT } from '../../actions/MainNavigation/mainNavigationTypes';

const INITIAL_STATE = {
  focusedElement: '',
  activeElement: '',
  menuTabs: [
    '/list/user/',
    '/list/web/',
    '/list/dns/',
    '/list/mail/',
    '/list/db/',
    '/list/cron/',
    '/list/backup/',
    '/list/package/',
    '/list/ip/',
    '/list/rrd/',
    '/list/stats/',
    '/list/log/',
    '/list/updates/',
    '/list/firewall/',
    '/list/directory/',
    '/list/server/'
  ]
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_FOCUSED_ELEMENT:
      return {
        ...state, focusedElement: action.value,
      };

    case REMOVE_FOCUSED_ELEMENT:
      return {
        ...state, focusedElement: action.value,
      };

    case ADD_ACTIVE_ELEMENT:
      return {
        ...state, activeElement: action.value,
      };

    case REMOVE_ACTIVE_ELEMENT:
      return {
        ...state, activeElement: action.value,
      };

    default: return state;
  }
};

export default reducer;