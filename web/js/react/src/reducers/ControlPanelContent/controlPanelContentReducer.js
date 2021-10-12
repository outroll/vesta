import { ADD_CPANEL_FOCUSED_ELEMENT, REMOVE_CPANEL_FOCUSED_ELEMENT } from '../../actions/ControlPanelContent/controlPanelContentTypes';

const INITIAL_STATE = {
  controlPanelFocusedElement: ''
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_CPANEL_FOCUSED_ELEMENT:
      return {
        ...state, controlPanelFocusedElement: action.value,
      };

    case REMOVE_CPANEL_FOCUSED_ELEMENT:
      return {
        ...state, controlPanelFocusedElement: '',
      };

    default: return state;
  }
};

export default reducer;