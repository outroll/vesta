import React from 'react';
import { useSelector } from 'react-redux';
import './Checkbox.scss';

function toggleAll(props, e) {
  props.toggleAll(e.target.checked);
}

const Checkbox = (props) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <div className="input-group-prepend">
      <div className="input-group-text">
        <input type="checkbox" onChange={(e) => toggleAll(props, e)} aria-label="Checkbox for following text input" id="checkbox" checked={props.toggled} />
      </div>
      <span className="input-group-text">
        <label htmlFor="checkbox">{i18n['toggle all']}</label>
      </span>
    </div>
  );
}

export default Checkbox;