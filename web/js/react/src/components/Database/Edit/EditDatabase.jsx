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
import { useDispatch } from 'react-redux';
import QS from 'qs';

import './EditDatabase.scss';
import { Helmet } from 'react-helmet';

const EditDatabase = props => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
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

    if (Object.keys(updatedDatabase).length !== 0 && updatedDatabase.constructor === Object) {
      setState({ ...state, loading: true });

      updateDatabase(updatedDatabase, state.data.database)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '', loading: false });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg, loading: false });
            } else {
              setState({ ...state, loading: false });
            }
          }
        })
        .catch(err => console.error(err));
    }
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
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-db">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextInputWithTextOnTheRight id="database" name="v_database" title={i18n['Database']} defaultValue={state.data.database} disabled />

            <TextInputWithTextOnTheRight id="username" name="v_dbuser" title={i18n['User']} defaultValue={state.data.dbuser} />

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