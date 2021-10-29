import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import Password from '../../../components/ControlPanel/AddItemLayout/Form/Password/Password';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { getLanguages } from '../../../ControlPanelService/Languages';
import { getPackageList } from '../../../ControlPanelService/Package';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addUser } from '../../../ControlPanelService/Users';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './AddUser.scss';
import { Helmet } from 'react-helmet';
import { checkAuthHandler } from 'src/actions/Session/sessionActions';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const AddUser = props => {
  const { i18n } = useSelector(state => state.session);
  const userLanguage = localStorage.getItem("language");
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    vEmail: '',
    vNotify: '',
    languages: [],
    packages: [],
    errorMessage: '',
    okMessage: '',
    loading: false
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/user/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });

    Promise.all([getAllPackages(), getAllLanguages()])
      .then(result => {
        const [packages, languages] = result;
        let packageNames = getPackageNames(packages.data.data);

        setState({ ...state, packages: packageNames, languages: languages.data, loading: false });
      });
  }, []);

  const getAllPackages = () => {
    return getPackageList().catch(err => console.error(err));
  }

  const getAllLanguages = () => {
    return getLanguages().catch(err => console.error(err));
  }

  const getPackageNames = packages => {
    let result = [];

    for (let i in packages) {
      result.push(i);
    }

    return result;
  }

  const submitFormHandler = event => {
    event.preventDefault();
    let newUser = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newUser[name] = value;
    }

    if (Object.keys(newUser).length !== 0 && newUser.constructor === Object) {
      setState({ ...state, loading: true });
      addUser(newUser)
        .then(result => {
          const { error_msg: errorMessage, ok_msg: okMessage } = result.data;

          if (errorMessage) {
            setState({ ...state, errorMessage, okMessage, loading: false });
          } else {
            dispatch(refreshCounters()).then(() => {
              setState({ ...state, okMessage, errorMessage: '', loading: false });
            });
          }
        })
        .catch(err => {
          setState({ ...state, loading: false });
          console.error(err);
        });
    }
  }

  const renderPackageOptions = () => {
    return state.packages.map((pack, index) => (
      <option key={index} value={pack}>{pack}</option>
    ));
  }

  const renderLanguageOptions = () => {
    return state.languages.map((language, index) => (
      <option key={index} selected={userLanguage === language} value={language}>{language}</option>
    ));
  }

  const onChangeEmail = value => {
    setState({ ...state, vEmail: value });
  }

  const onBlurEmail = () => {
    if (!state.vNotify) {
      setState({ ...state, vNotify: state.vEmail });
    }
  }

  const onChangeSecondEmail = value => {
    setState({ ...state, vNotify: value });
  }

  const repeatEmailHandler = checked => {
    if (checked) {
      if (state.vEmail) {
        setState({ ...state, vNotify: state.vEmail });
      }
    } else {
      setState({ ...state, vNotify: '' });
    }
  }

  return (
    <div className="edit-template add-user">
      <Helmet>
        <title>{`Vesta - ${i18n.USER}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding User']}</div>
        <div className="error"><span className="error-message">{state.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}</span></div>
        <div className="success">
          <span className="ok-message">{state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span>{HtmlParser(state.okMessage)}</span> </span>
        </div>
      </Toolbar>
      <AddItemLayout>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="add-user">
            <div className="form-group">
              <label htmlFor="username">{i18n.Username}</label>
              <input type="text" className="form-control" id="username" name="v_username" />
            </div>

            <Password name='v_password' />

            <div className="form-group">
              <label htmlFor="email">
                {i18n.Email} /
                <div>
                  <input
                    type="checkbox"
                    id="send-credentials"
                    onChange={event => repeatEmailHandler(event.target.checked)} />
                  <label htmlFor="send-credentials">{i18n['Send login credentials to email address']}</label>
                </div>
              </label>
              <input
                type="email"
                name="v_email"
                className="form-control"
                id="email"
                value={state.vEmail}
                onChange={event => onChangeEmail(event.target.value)}
                onBlur={() => onBlurEmail()} />
            </div>

            <div class="form-group">
              <label htmlFor="package">{i18n.Package}</label>
              <select class="form-control" id="package" name="v_package">
                {renderPackageOptions()}
              </select>
            </div>

            <div class="form-group">
              <label htmlFor="language">{i18n.Language}</label>
              <select class="form-control" id="language" name="v_language">
                {renderLanguageOptions()}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="firstName">{i18n['First Name']}</label>
              <input type="text" className="form-control" id="firstName" name="v_fname" />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">{i18n['Last Name']}</label>
              <input type="text" className="form-control" id="lastName" name="v_lname" />
            </div>

            <div className="form-group">
              <label htmlFor="sendLoginCredentialsToEmailAddress">{i18n['Send login credentials to email address']}</label>
              <input
                type="email"
                className="form-control"
                id="sendLoginCredentialsToEmailAddress"
                value={state.vNotify}
                onChange={e => onChangeSecondEmail(e.target.value)}
                name="v_notify" />
            </div>

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add}</button>
              <button type="button" className="back" onClick={() => history.push('/list/user/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default AddUser;