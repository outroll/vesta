import { REFRESH_PANEL } from '../../actions/Panel/panelTypes';

const INITIAL_STATE = {
  panel: {}
};

const panelReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REFRESH_PANEL:
      return {
        ...state,
        panel: action.value.panel
      };

    default: return state;
  }
};

export default panelReducer;
