import React, { useEffect, useState } from 'react';

import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Password from 'src/components/ControlPanel/AddItemLayout/Form/Password/Password';
import LoginLayout from 'src/components/ControlPanel/LoginLayout/LoginLayout';
import { resetPassword } from 'src/ControlPanelService/ResetPassword';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { reset } from 'src/actions/Session/sessionActions';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'src/components/Spinner/Spinner';
import ReactHtmlParser from 'react-html-parser';
import { Helmet } from 'react-helmet';
import QueryString from 'qs';

export default function ForgotPassword() {
  const { i18n } = window.GLOBAL.App;
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    action: '',
    user: '',
    code: '',
  });
  const session = useSelector(state => state.session);
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const parsedQueryString = QueryString.parse(location.search, { ignoreQueryPrefix: true });

    setState({
      ...state,
      action: parsedQueryString.action || '',
      user: parsedQueryString.user || '',
      code: parsedQueryString.code || ''
    });
  }, []);

  useEffect(() => {
    if (session.error) {
      setErrorMessage(session.error);
      return;
    }

    if (session.token) {
      history.push('/list/user/');
    }
  }, [session]);

  const submitHandler = event => {
    event.preventDefault();

    if (!state.code && !state.user) return;

    if (!state.action && state.user) {
      completeStep1();
      return;
    }

    if (state.action === 'code' && state.user && state.code) {
      completeStep2();
      return;
    }

    setLoading(true);
    const data = { user: state.user, code: state.code };

    for (var [name, value] of (new FormData(event.target)).entries()) {
      data[name] = value;
    }

    dispatch(reset(data))
      .then(res => {
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          history.push('/login');
          setErrorMessage('');
        }

        setLoading(false);
      });
  }

  const changeInputHandler = event => {
    const { value, name } = event.target;

    setState({ ...state, [name]: value });
  }

  const completeStep1 = () => {
    if (!state.user) return;
    setLoading(true);

    resetPassword(state.user)
      .then(res => {
        setErrorMessage(res.data.error || '');
        setState({ ...state, action: 'code' });
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }

  const completeStep2 = () => {
    setState({ ...state, action: 'confirm' });
  }

  return (
    <div className="login-page">
      <Helmet>
        <title>{`Vesta - ${i18n['RESET PASSWORD']}`}</title>
      </Helmet>
      {loading && <Spinner />}
      <div className="login-form-wrapper">
        <LoginLayout>
          <form onSubmit={submitHandler}>
            <div className="c1">
              <Link to="/">
                <img src="https://r5.vestacp.com:8083/images/vesta_logo.png" alt="Logo" />
              </Link>
            </div>
            <div className="c2">
              {
                !state.action && (
                  <>
                    <TextInput
                      onChange={changeInputHandler}
                      title={i18n['Username']}
                      value={state.user}
                      name="user"
                      id="user" />

                    <div className="buttons-wrapper">
                      <button className="add" type="button" onClick={completeStep1}>{i18n.Submit}</button>
                      <button className="back" type="button" onClick={() => history.push('/login')}>{i18n.Back}</button>
                    </div>
                  </>
                )
              }

              {
                state.action === 'code' && (
                  <>
                    <span>{ReactHtmlParser(i18n['RESET_CODE_SENT'])}</span><br />

                    <TextInput
                      onChange={changeInputHandler}
                      title={i18n['Reset Code']}
                      value={state.code}
                      name="code"
                      id="code" />

                    <div className="buttons-wrapper">
                      <button className="add" type="button" onClick={completeStep2}>{i18n.Confirm}</button>
                      <button className="back" type="button" onClick={() => setState({ ...state, action: '', code: '', user: '' })}>{i18n.Back}</button>
                    </div>
                  </>
                )
              }

              {
                state.action === 'confirm' && (
                  <>
                    <Password name='password' title={i18n['New Password']} showGenerationButton={false} tabIndex={1} />

                    <Password name='password_confirm' title={i18n['Confirm Password']} showGenerationButton={false} tabIndex={2} />

                    <div className="buttons-wrapper">
                      <button className="add" type="submit" style={{ height: '31px' }}>{i18n.Reset}</button>
                      <button className="back" type="button" onClick={() => setState({ ...state, action: 'code', code: '', user: state.user })}>{i18n.Back}</button>
                    </div>
                  </>
                )
              }

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
