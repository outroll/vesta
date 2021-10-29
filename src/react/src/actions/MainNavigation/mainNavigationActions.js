import { ADD_FOCUSED_ELEMENT, ADD_ACTIVE_ELEMENT, REMOVE_FOCUSED_ELEMENT, REMOVE_ACTIVE_ELEMENT } from './mainNavigationTypes';

export const addFocusedElement = value => {
  return {
    type: ADD_FOCUSED_ELEMENT,
    value
  };
};

export const removeFocusedElement = () => {
  return {
    type: REMOVE_FOCUSED_ELEMENT,
    value: ''
  };
};

export const addActiveElement = value => {
  return {
    type: ADD_ACTIVE_ELEMENT,
    value
  };
};

export const removeActiveElement = () => {
  return {
    type: REMOVE_ACTIVE_ELEMENT,
    value: ''
  };
};