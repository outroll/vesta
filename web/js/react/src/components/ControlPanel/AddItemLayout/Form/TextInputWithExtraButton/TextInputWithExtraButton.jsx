import React, { useEffect, useState } from 'react';

const TextInputWithExtraButton = props => {
  const [state, setState] = useState({
    value: '',
    previousValue: ''
  });

  useEffect(() => {
    if (props.value !== 'unlimited') {
      setState({ ...state, value: state.previousValue });
    } else {
      setState({ ...state, value: props.value });
    }
  }, [props.value]);

  useEffect(() => {
    setState({ ...state, value: props.value, previousValue: props.value });
  }, []);

  const changeValue = event => {
    let inputValue = event.target.value;

    setState({ ...state, value: inputValue, previousValue: inputValue });
  }

  return (
    <div class="form-group">
      <label className="label-wrapper" htmlFor={props.id}>
        {props.title}
        <span className="lowercase">{props.optionalTitle ? `(${props.optionalTitle})` : ''}</span>
      </label>
      <div className="input-wrapper">
        <input
          type="text"
          name={props.name}
          id={props.id}
          className="form-control"
          onChange={changeValue}
          value={state.value}
          readOnly={state.value === 'unlimited'} />
        {props.children}
      </div>
    </div>
  );
}

export default TextInputWithExtraButton;