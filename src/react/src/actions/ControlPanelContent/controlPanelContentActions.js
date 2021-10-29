import { ADD_CPANEL_FOCUSED_ELEMENT, REMOVE_CPANEL_FOCUSED_ELEMENT } from './controlPanelContentTypes';

export const addControlPanelContentFocusedElement = value => {
  return {
    type: ADD_CPANEL_FOCUSED_ELEMENT,
    value
  };
};

export const removeControlPanelContentFocusedElement = () => {
  return {
    type: REMOVE_CPANEL_FOCUSED_ELEMENT,
    value: ''
  };
};