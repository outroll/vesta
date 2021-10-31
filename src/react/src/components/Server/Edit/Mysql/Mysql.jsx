import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../../actions/MainNavigation/mainNavigationActions";
import TextInput from '../../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from '../../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import TextArea from '../../../ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import { getServiceInfo, updateService } from 'src/ControlPanelService/Server';
import AddItemLayout from '../../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../../components/Spinner/Spinner';
import Toolbar from '../../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './Mysql.scss';
import { Helmet } from 'react-helmet';
import HtmlParser from 'react-html-parser';

const Mysql = ({ serviceName = '' }) => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [okMessage, setOkMessage] = useState('');
  const [restart, setRestart] = useState(true);
  const [state, setState] = useState({
    data: {},
    loading: false,
    basicOptions: true,
    advancedOptions: false
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/server/'));
    dispatch(removeFocusedElement());

    if (!serviceName) {
      history.push('/list/server');
    }

    setState({ ...state, loading: true });
    fetchData();
  }, []);

  const fetchData = () => {
    getServiceInfo('mysql')
      .then(response => {
        if (response.data.config.includes('Error')) {
          history.push('/list/server');
        }

        setState({ ...state, data: response.data, loading: false });
      })
      .catch(err => {
        setState({ ...state, loading: false });
        console.error(err);
      });
  }

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedService = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedService[name] = value;
    }

    if (Object.keys(updatedService).length !== 0 && updatedService.constructor === Object) {
      setState({ ...state, loading: true });

      updatedService['v_config'] = state.data.config;
      updatedService['v_restart'] = restart ? 'yes' : 'no';

      updateService(updatedService, `/${serviceName}`)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            setErrorMessage(error_msg || '');
            setOkMessage(ok_msg || '');
          }
        })
        .then(() => fetchData())
        .catch(err => console.error(err));
    }
  }

  const toggleOptions = () => {
    setState({
      ...state,
      advancedOptions: !state.advancedOptions,
      basicOptions: !state.basicOptions
    });
  }

  const onUpdateConfig = ({ id, value }) => {
    if (!value) return;

    var regexp = new RegExp(`(${id})(.+)(${state.data[id]})`, 'gm');
    const updatedConfig = state.data.config.replace(regexp, `$1$2${value}`);
    setState({ ...state, data: { ...state.data, config: updatedConfig, [id]: value } });
  }

  return (
    <div className="edit-template edit-mysql">
      <Helmet>
        <title>{`Vesta - ${i18n.SERVER}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Configuring Server']} / {state.data.service_name}</div>
        <div className="error">
          <span className="error-message">
            {errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {errorMessage}
          </span>
        </div>
        <div className="success">
          <span className="ok-message">
            {okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span>{HtmlParser(okMessage)}</span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-mysql">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            {
              !state.basicOptions && (
                <button type="button" onClick={() => toggleOptions()}>
                  {i18n['Basic options']}
                  {state.basicOptions ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
                </button>
              )
            }

            {
              state.basicOptions && (
                <>
                  <TextInput
                    id="max_connections"
                    title="max_connections"
                    name="v_max_connections"
                    onChange={event => onUpdateConfig(event.target)}
                    value={state.data.max_connections} />

                  <TextInput
                    id="max_user_connections"
                    title="v_max_user_connections"
                    name="v_max_user_connections"
                    onChange={event => onUpdateConfig(event.target)}
                    value={state.data.max_user_connections} />

                  <TextInput
                    id="wait_timeout"
                    title="v_wait_timeout"
                    name="v_wait_timeout"
                    onChange={event => onUpdateConfig(event.target)}
                    value={state.data.wait_timeout} />

                  <TextInput
                    id="interactive_timeout"
                    title="v_interactive_timeout"
                    name="v_interactive_timeout"
                    onChange={event => onUpdateConfig(event.target)}
                    value={state.data.interactive_timeout} />

                  <TextInput
                    id="display_errors"
                    title="v_display_errors"
                    name="v_display_errors"
                    onChange={event => onUpdateConfig(event.target)}
                    value={state.data.max_allowed_packet} />
                </>
              )
            }

            {
              !state.advancedOptions && (
                <button type="button" onClick={() => toggleOptions()}>
                  {i18n['Advanced options']}
                  {state.advancedOptions ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
                </button>
              )
            }

            <br />
            <br />

            {
              state.advancedOptions && (
                <>
                  <TextArea
                    defaultValue={state.data.config}
                    title={state.data.config_path}
                    onChange={e => setState({ ...state, data: { ...state.data, config: e.target.value } })}
                    name="v_config"
                    id="v_config"
                    rows="25" />

                  <br />

                  <Checkbox
                    title={i18n['restart']}
                    defaultChecked={true}
                    onChange={checked => setRestart(checked)}
                    name="v_restart"
                    id="restart" />
                </>
              )
            }

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

export default Mysql;