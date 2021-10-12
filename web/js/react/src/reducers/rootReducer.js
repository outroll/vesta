import { combineReducers } from 'redux';
import mainNavigationReducer from './MainNavigation/mainNavigationReducer';
import controlPanelContentReducer from './ControlPanelContent/controlPanelContentReducer';
import sessionReducer from './Session/sessionReducer';

export default combineReducers({
  mainNavigation: mainNavigationReducer,
  controlPanelContent: controlPanelContentReducer,
  session: sessionReducer,
});