import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Password = ({ defaultValue, onChange = () => { }, id, name, title, showGenerationButton = true, ...props }) => {
  const { i18n } = useSelector(state => state.session);
  const [state, setState] = useState({
    hidePassword: false,
    generatedPassword: ''
  });

  useEffect(() => {
    if (defaultValue && !state.generatedPassword) {
      setState({ ...state, generatedPassword: defaultValue });
    }
  }, [defaultValue]);

  const hidePasswordHandler = () => {
    setState({ ...state, hidePassword: !state.hidePassword });
  }

  const generatePassword = () => {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let stringLength = 10;
    let result = '';

    for (var i = 0; i < stringLength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      result += chars.substr(randomNumber, 1);
    }

    setState({ ...state, generatedPassword: result });
  }

  const passwordInputHandler = value => {
    setState({ ...state, generatedPassword: value });
    onChange(value);
  }

  return (
    <div className="form-group">
      <label htmlFor="password">
        {title ? title : i18n.Password}
        {
          showGenerationButton && (
            <> / <button type="button" className="generate-password" onClick={() => generatePassword()}>
              {i18n.Generate}
            </button></>
          )
        }
      </label>
      <div className="password-wrapper">
        <input
          type={state.hidePassword ? 'password' : 'text'}
          className="form-control"
          id={`password_${id}`}
          name={name}
          value={state.generatedPassword}
          onChange={event => passwordInputHandler(event.target.value)}
          {...props} />
        <button type="button" onClick={() => hidePasswordHandler()}>
          {state.hidePassword ?
            <span className="eye-slash"><FontAwesomeIcon icon="eye-slash" /></span> :
            <span className="eye"><FontAwesomeIcon icon="eye" /></span>}
        </button>
      </div>
    </div>
  );
}

export default Password;
