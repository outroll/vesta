import React, { useEffect, useState } from 'react';

import { Link, useHistory } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/Session/sessionActions';
import LoginLayout from '../ControlPanel/LoginLayout/LoginLayout';
import TextInput from '../ControlPanel/AddItemLayout/Form/TextInput/TextInput';

import './Login.scss';
import { Helmet } from 'react-helmet';

export default function LoginForm() {
  const { i18n } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    user: '',
    password: ''
  });
  const session = useSelector(state => state.session);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (session.error) {
      setErrorMessage(session.error);
      return;
    }

    if (session.token && session.userName) {
      history.push('/list/user/');
    }
  }, [session]);

  const submitHandler = event => {
    event.preventDefault();
    const { user, password } = formValues;

    setLoading(true);

    dispatch(login(user, password))
      .then((res) => {
        setLoading(false);
      });
  }

  const changeInputHandler = event => {
    const { value, name } = event.target;

    setFormValues({
      ...formValues,
      [name]: value
    });
  }

  return (
    <div className="login-page">
      <Helmet>
        <title>{`Vesta - ${i18n.LOGIN ?? 'LOGIN'}`}</title>
      </Helmet>
      {loading && <Spinner />}
      <div className="login-form-wrapper">
        <LoginLayout>
          <form onSubmit={submitHandler}>
            <div className="c1">
              <Link to="/">
                <img src="/images/logo.png" alt="Logo" />
              </Link>
            </div>
            <div className="c2">
              <TextInput
                onChange={changeInputHandler}
                title={i18n['Username'] ?? 'Username'}
                value={formValues.user}
                name="user"
                id="user" />

              <TextInput
                onChange={changeInputHandler}
                title={i18n['Password'] ?? 'Password'}
                value={formValues.password}
                optionalTitle={(
                  <Link className="forgot-password" tabIndex="-1" to="/reset">
                    {i18n['forgot password'] ?? 'forgot password'}
                  </Link>
                )}
                name="password"
                type="password"
                id="password" />

              <button type="submit" disabled={loading} className={loading ? 'disabled' : ''}>
                {i18n['Log in'] ?? 'Log in'}
              </button>

              <div className="error-message">{errorMessage}</div>
            </div>
          </form>

          <span>
            <a href="http://vestacp.com/">vestacp.com</a>
          </span>
        </LoginLayout>
      </div>
    </div>
  );
}
