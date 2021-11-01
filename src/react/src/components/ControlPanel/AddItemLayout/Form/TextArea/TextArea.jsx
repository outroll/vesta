import React from 'react';

const TextArea = ({ id, name, defaultValue = '', title, optionalTitle = '', rows = '3', disabled = false, ...rest }) => {
  return (
    <div className="form-group">
      <label className="label-wrapper" htmlFor={id}>
        {title}
        <span>{optionalTitle}</span>
      </label>
      <textarea
        className="form-control"
        id={id}
        rows={rows}
        name={name}
        readOnly={disabled}
        defaultValue={defaultValue}
        {...rest}
      >
      </textarea>
    </div>
  );
}

export default TextArea;
