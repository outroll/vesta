import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { dbCharsets, addDatabase, getDbOptionalInfo } from '../../../ControlPanelService/Db';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import Password from '../../ControlPanel/AddItemLayout/Form/Password/Password';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch } from 'react-redux';

import './AddDatabase.scss'
import { Helmet } from 'react-helmet';

const AddDatabase = props => {
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    okMessage: '',
    errorMessage: '',
    dbTypes: [],
    dbHosts: [],
    dbCharsets: [],
    user: '',
    maxCharLength: '',
    databaseInputValue: '',
    databaseUserInputValue: '',
    prefixI18N: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/db/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });

    getDbOptionalInfo()
      .then(result => {
        if (result.status === 200) {
          setState({
            ...state,
            dbCharsets,
            user: result.data.user,
            dbTypes: result.data.dbTypes,
            prefixI18N: result.data.prefixI18N,
            maxCharLength: result.data.maxCharLength,
            dbHosts: result.data.dbHosts,
            loading: false
          });
        }
      })
      .catch(err => console.err(err));
  }, []);

  const renderDatabaseTypesOptions = () => {
    return state.dbTypes.map((dbType, index) => <option key={index} value={dbType}>{dbType}</option>)
  }

  const renderDatabaseHostsOptions = () => {
    return state.dbHosts.map((dbHost, index) => <option key={index} value={dbHost}>{dbHost}</option>)
  }

  const renderDatabaseCharsetOptions = () => {
    return state.dbCharsets.map((dbCharset, index) =>
      <option
        key={index}
        value={dbCharset}
        selected={dbCharset === 'utf8'}>
        {dbCharset}
      </option>
    );
  }

  const databaseUserInputHandler = value => {
    setState({ ...state, databaseUserInputValue: value });
  }

  const databaseInputHandler = value => {
    setState({ ...state, databaseInputValue: value });
  }

  const submitFormHandler = event => {
    event.preventDefault();
    let newDatabase = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newDatabase[name] = value;
    }

    newDatabase['v_database'] = `${state.user}_${state.databaseInputValue}`;
    newDatabase['v_dbuser'] = `${state.user}_${state.databaseUserInputValue}`;

    if (Object.keys(newDatabase).length !== 0 && newDatabase.constructor === Object) {
      setState({ ...state, loading: true });

      addDatabase(newDatabase)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '', loading: false });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg, loading: false });
            } else {
              setState({ ...state, loading: false })
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="edit-template add-db">
      <Helmet>
        <title>{`Vesta - ${i18n.DB}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding database']}</div>
        <div className="error">
          <span className="error-message">
            {state.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            {state.errorMessage}</span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout>
        {state.loading ? <Spinner /> : (
          <form onSubmit={event => submitFormHandler(event)}>
            <input type="hidden" name="ok" value="add" />
            <input type="hidden" name="token" value={token} />

            <span className="prefix" dangerouslySetInnerHTML={{ __html: state.prefixI18N }}></span>

            <div className="form-group database">
              <label htmlFor="database">{i18n.Database}</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="form-control"
                  id="database"
                  onChange={event => databaseInputHandler(event.target.value)}
                  value={state.databaseInputValue}
                  name="v_database" />
                <span className="italic">{`${state.user}_${state.databaseInputValue}`}</span>
              </div>
            </div>

            <div className="form-group">
              <div className="label-wrapper">
                <label htmlFor="user">{i18n.User}</label>
                <span className="italic">({state.maxCharLength})</span>
              </div>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="form-control"
                  id="user"
                  value={state.databaseUserInputValue}
                  onChange={event => databaseUserInputHandler(event.target.value)}
                  name="v_dbuser" />
                <span className="italic">{`${state.user}_${state.databaseUserInputValue}`}</span>
              </div>
            </div>

            <Password name={'v_password'} />

            <div class="form-group">
              <label htmlFor="dbTypes">{i18n.Type}</label>
              <select class="form-control" id="dbTypes" name="v_type">
                {renderDatabaseTypesOptions()}
              </select>
            </div>

            <div class="form-group">
              <label htmlFor="dbHosts">{i18n.Host}</label>
              <select class="form-control" id="dbHosts" name="v_host">
                {renderDatabaseHostsOptions()}
              </select>
            </div>

            <div class="form-group">
              <label htmlFor="dbCharset">{i18n.Charset}</label>
              <select class="form-control" id="dbCharset" name="v_charset">
                {renderDatabaseCharsetOptions()}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sendLoginCredentialsToEmailAddress">{i18n['Send login credentials to email address']}</label>
              <input
                type="email"
                className="form-control"
                id="sendLoginCredentialsToEmailAddress"
                name="v_db_email" />
            </div>

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add}</button>
              <button type="button" className="back" onClick={() => history.push('/list/db/')}>{i18n.Back}</button>
            </div>
          </form>
        )}
      </AddItemLayout>
    </div>
  );
}

export default AddDatabase;