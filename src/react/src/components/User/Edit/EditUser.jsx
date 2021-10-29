import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import Password from '../../../components/ControlPanel/AddItemLayout/Form/Password/Password';
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import NameServers from '../../ControlPanel/AddItemLayout/Form/NameServers/NameServers';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import { updateUser, getUserInfo } from '../../../ControlPanelService/Users';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QS from 'qs';

import './EditUser.scss';
import { Helmet } from 'react-helmet';
import { checkAuthHandler } from 'src/actions/Session/sessionActions';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const EditUser = props => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
    username: '',
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { user } = queryParams;

    dispatch(addActiveElement('/list/user/'));
    dispatch(removeFocusedElement());

    if (user) {
      setState({ ...state, loading: true });

      getUserInfo(user)
        .then(response => {
          setState({
            ...state,
            username: user,
            data: response.data, errorMessage: response.data['error_msg'], okMessage: response.data['ok_msg'],
            loading: false
          });
        })
        .catch(err => console.error(err));
    }
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedUser = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedUser[name] = value;
    }

    updatedUser['v_username'] = state.username;

    if (Object.keys(updatedUser).length !== 0 && updatedUser.constructor === Object) {
      setState({ ...state, loading: true });

      updateUser(updatedUser, state.username)
        .then(result => {
          if (result.status === 200) {
            const { error_msg: errorMessage, ok_msg: okMessage } = result.data;

            if (errorMessage) {
              setState({ ...state, errorMessage, okMessage, loading: false });
            } else {
              dispatch(refreshCounters()).then(() => {
                setState({ ...state, okMessage, errorMessage: '', loading: false });
              });
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  const convertObjectOfObjectsToArrayOfObjects = object => {
    let result = [];

    for (let i in object) {
      result.push(i);
    }

    return result;
  }

  return (
    <div className="edit-template edit-user">
      <Helmet>
        <title>{`Vesta - ${i18n.USER}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing User']}</div>
        <div className="error"><span className="error-message">{state.data.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}</span></div>
        <div className="success">
          <span className="ok-message">{state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span>{HtmlParser(state.okMessage)}</span> </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="add-user">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextInput id="username" name="v_user" title={i18n['Username']} value={state.username} disabled />

            <Password name='v_password' />

            <TextInput id="email" name="v_email" title={i18n['Email']} value={state.data.email} />

            <SelectInput
              options={convertObjectOfObjectsToArrayOfObjects(state.data.packages)}
              selected={state.data.package}
              name="v_package"
              id="packages"
              title={i18n['Package']} />

            <SelectInput
              options={state.data.languages}
              selected={state.data.language}
              name="v_language"
              id="languages"
              title={i18n['Language']} />

            <TextInput id="first-name" name="v_fname" title={i18n['First Name']} value={state.data.fname} />

            <TextInput id="last-name" name="v_lname" title={i18n['Last Name']} value={state.data.lname} />

            <SelectInput
              options={state.data.shells}
              selected={state.data.shell}
              name="v_shell"
              id="shell"
              title={i18n['SSH Access']} />

            <NameServers usersNS={state.data.nameservers} />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/user/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditUser;