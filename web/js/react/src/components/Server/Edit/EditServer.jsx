import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { getServerAdditionalInfo, updateService } from '../../../ControlPanelService/Server';
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import EditServerWebOption from './EditServerWebOption';
import EditServerDnsOption from './EditServerDnsOption';
import EditVestaPluginsOption from './EditVestaPlugins';
import EditVestaSslOption from './EditVestaSslOption';
import EditDatabaseOption from './EditDatabaseOption';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import EditBackupOption from './EditBackupOption';
import EditMailOption from './EditMailOption';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './EditServer.scss';
import { Helmet } from 'react-helmet';
import HtmlParser from 'react-html-parser';

const EditServer = props => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
    webOption: false,
    dnsOption: false,
    mailOption: false,
    backupOption: false,
    sslOption: false,
    pluginsOption: false,
    dbOption: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/server/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });

    getServerAdditionalInfo()
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

  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedServer = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedServer[name] = value;
    }

    updatedServer['save'] = 'save';
    updatedServer['token'] = token;

    if (Object.keys(updatedServer).length !== 0 && updatedServer.constructor === Object) {
      setState({ ...state, loading: true });

      updateService(updatedServer)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;
            setState({ ...state, errorMessage: error_msg || '', okMessage: ok_msg || '', loading: false });
          }
        })
        .catch(err => console.error(err));
    }
  }

  const toggleOption = option => {
    setState({
      ...state,
      [option]: !state[option]
    });
  }

  return (
    <div className="edit-template edit-server">
      <Helmet>
        <title>{`Vesta - ${i18n.SERVER}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Configuring Server']}</div>
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
      <AddItemLayout>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-server">
            <TextInput
              value={state.data.hostname}
              title={i18n['Hostname']}
              name="v_hostname"
              id="hostname" />

            {
              state.data.timezones && (
                <div className="form-group select-group">
                  <label className="label-wrapper" htmlFor="timezone">
                    {i18n['Time Zone']}
                  </label>
                  <select className="form-control" id="timezone" name="v_timezone">
                    {
                      Object.keys(state.data.timezones).map(key => {
                        const value = state.data.timezones[key];

                        return <option key={key} value={key} selected={state.data.timezone === key}>{value}</option>;
                      })
                    }
                  </select>
                </div>
              )
            }

            <SelectInput
              options={state.data.languages}
              selected={state.data.language}
              title={i18n['Default Language']}
              name="v_language"
              id="language" />

            <div className="modules">
              <button type="button" onClick={() => toggleOption('webOption')}>
                {i18n['WEB']}
                {state.webOption ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
              </button>

              <EditServerWebOption
                webBackendPool={state.data.web_backend_pool}
                proxySystem={state.data.proxy_system}
                webBackend={state.data.web_backend}
                webSystem={state.data.web_system}
                visible={state.webOption} />

              <button type="button" onClick={() => toggleOption('dnsOption')}>
                {i18n['DNS']}
                {state.dnsOption ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
              </button>

              <EditServerDnsOption
                selected={state.data.v_dns_cluster}
                dnsCluster={state.data.dns_cluster}
                dnsSystem={state.data.dns_system}
                visible={state.dnsOption} />

              <button type="button" onClick={() => toggleOption('mailOption')}>
                {i18n['MAIL']}
                {state.mailOption ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
              </button>

              <EditMailOption data={state.data} visible={state.mailOption} />

              <button type="button" onClick={() => toggleOption('dbOption')}>
                {i18n['DB']}
                {state.dbOption ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
              </button>

              <EditDatabaseOption data={state.data} visible={state.dbOption} />

              <button type="button" onClick={() => toggleOption('backupOption')}>
                {i18n['BACKUP']}
                {state.backupOption ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
              </button>

              <EditBackupOption data={state.data} visible={state.backupOption} />

              <button type="button" onClick={() => toggleOption('sslOption')}>
                {i18n['Vesta SSL']}
                {state.sslOption ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
              </button>

              <EditVestaSslOption data={state.data} visible={state.sslOption} />

              <button type="button" onClick={() => toggleOption('pluginsOption')}>
                {i18n['Vesta Control Panel Plugins']}
                {state.pluginsOption ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
              </button>

              <EditVestaPluginsOption data={state.data} visible={state.pluginsOption} />
            </div>

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/server/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditServer;
