import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Hotkeys.scss'

const HotkeysButton = (props) => {
  return (
    <div className="hotkeys-button" onClick={props.open}>
      <FontAwesomeIcon icon="ellipsis-h" />
    </div>
  );
}

export default HotkeysButton;