import React, { useEffect, useState } from 'react';

import './TextInputWithTextOnTheRight.scss';

const TextInputWithTextOnTheRight = ({ id, title, name, defaultValue = '', optionalTitle = '', disabled = false }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="form-group text-on-the-right">
      <label className="label-wrapper" htmlFor={id}>
        {title}
        <span>{optionalTitle || ''}</span>
      </label>
      <div className="input-wrapper">
        <input
          defaultValue={`admin_${defaultValue}`}
          type="text"
          className="form-control"
          id={id}
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={disabled}
          name={name} />
        <span><i>{`${inputValue}`}</i></span>
      </div>
    </div>
  );
}

export default TextInputWithTextOnTheRight;