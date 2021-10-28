import React, { useEffect, useState } from 'react';
import TextInputWithTextOnTheRight from '../../ControlPanel/AddItemLayout/Form/TextInputWithTextOnTheRight/TextInputWithTextOnTheRight';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { getDatabaseInfo, updateDatabase } from '../../../ControlPanelService/Db';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Password from '../../ControlPanel/AddItemLayout/Form/Password/Password';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QS from 'qs';

import './EditDatabase.scss';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const EditDatabase = props => {
  const token = localStorage.getItem("token");
  const { i18n, userName } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
    databaseUserInputValue: '',
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { database } = queryParams;

    dispatch(addActiveElement('/list/db/'));
    dispatch(removeFocusedElement());

    if (database) {
      setState({ ...state, loading: true });

      getDatabaseInfo(database)
        .then(response => {
          setState({
            ...state,
            data: response.data,
            databaseUserInputValue: response.data.dbuser.split('_').splice(1).join('_'),
            errorMessage: response.data['error_msg'],
            okMessage: response.data['ok_msg'],
            loading: false
          });
        })
        .catch(err => console.error(err));
    }
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedDatabase = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedDatabase[name] = value;
    }

    updatedDatabase['v_database'] = state.data.database;
    updatedDatabase['v_dbuser'] = `${userName}_${state.databaseUserInputValue}`;

    if (Object.keys(updatedDatabase).length !== 0 && updatedDatabase.constructor === Object) {
      setState({ ...state, loading: true });

      updateDatabase(updatedDatabase, state.data.database)
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

  const databaseUserInputHandler = value => {
    setState({ ...state, databaseUserInputValue: value });
  }

  return (
    <div className="edit-template edit-db">
      <Helmet>
        <title>{`Vesta - ${i18n.DB}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing Database']}</div>
        <div className="error">
          <span className="error-message">
            {state.data.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}
          </span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span>{HtmlParser(state.okMessage)}</span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-db">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextInputWithTextOnTheRight id="database" name="v_database" title={i18n['Database']} defaultValue={state.data.database} disabled />

            <div className="form-group">
              <div className="label-wrapper">
                <label htmlFor="user">{i18n.User}</label>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="form-control"
                  id="user"
                  value={state.databaseUserInputValue}
                  onChange={event => databaseUserInputHandler(event.target.value)}
                  name="v_dbuser" />
                <span className="italic"><i>{`${userName}_${state.databaseUserInputValue}`}</i></span>
              </div>
            </div>

            <Password name="v_password" defaultValue={state.data.password} />

            <TextInput id="type" name="v_type" title={i18n['Type']} value={state.data.type} disabled />

            <TextInput id="host" name="v_host" title={i18n['Host']} value={state.data.host} disabled />

            <TextInput id="charset" name="v_charset" title={i18n['Charset']} value={state.data.charset} disabled />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/db/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditDatabase;