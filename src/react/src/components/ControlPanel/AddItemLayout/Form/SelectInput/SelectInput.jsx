import React from 'react';
import { useSelector } from 'react-redux';

const SelectInput = ({ options = [], id, name, title, optionalTitle = '', selected = '', onChange = () => { }, disabled = false }) => {
  const { i18n } = useSelector(state => state.session);

  const renderOptions = () => {
    return options.map((option, index) =>
      <option key={index} selected={selected === option} value={option === i18n['Disable and Cancel Licence'] ? 'cancel' : option}>
        {option}
      </option>
    );
  }

  return (
    <>
      {
        options
          ? (
            <div className="form-group select-group">
              <label className="label-wrapper" htmlFor={id}>
                {title}
                <span>{optionalTitle}</span>
              </label>
              <select className="form-control" id={id} name={name} disabled={disabled} onChange={event => onChange(event.target.value)}>
                {disabled && <input type="hidden" name={name} value={selected || options[0]} />}
                {renderOptions()}
              </select>
            </div>
          )
          : null
      }
    </>
  );
}

export default SelectInput;
