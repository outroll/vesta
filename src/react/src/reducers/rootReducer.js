import { combineReducers } from 'redux';
import mainNavigationReducer from './MainNavigation/mainNavigationReducer';
import controlPanelContentReducer from './ControlPanelContent/controlPanelContentReducer';
import notificationReducer from './Notification/notificationReducer';
import menuCounterReducer from './MenuCounters/menuCounterReducer';
import sessionReducer from './Session/sessionReducer';

export default combineReducers({
  mainNavigation: mainNavigationReducer,
  controlPanelContent: controlPanelContentReducer,
  notifications: notificationReducer,
  menuCounters: menuCounterReducer,
  session: sessionReducer,
});