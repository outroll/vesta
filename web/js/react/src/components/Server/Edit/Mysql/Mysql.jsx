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
  const [state, setState] = useState({
    data: {},
    loading: false,
    basicOptions: true,
    advancedOptions: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/server/'));
    dispatch(removeFocusedElement());

    if (!serviceName) {
      history.push('/list/server');
    }

    setState({ ...state, loading: true });

    getServiceInfo('mysql')
      .then(response => {
        if (response.data.config.includes('Error')) {
          history.push('/list/server');
        }

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
    let updatedService = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedService[name] = value;
    }

    if (Object.keys(updatedService).length !== 0 && updatedService.constructor === Object) {
      setState({ ...state, loading: true });

      updateService(updatedService, `/${serviceName}`)
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

  const toggleOptions = () => {
    setState({
      ...state,
      advancedOptions: !state.advancedOptions,
      basicOptions: !state.basicOptions
    });
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
                    value={state.data.max_connections} />

                  <TextInput
                    id="v_max_user_connections"
                    title="v_max_user_connections"
                    name="v_max_user_connections"
                    value={state.data.max_user_connections} />

                  <TextInput
                    id="v_wait_timeout"
                    title="v_wait_timeout"
                    name="v_wait_timeout"
                    value={state.data.wait_timeout} />

                  <TextInput
                    id="v_interactive_timeout"
                    title="v_interactive_timeout"
                    name="v_interactive_timeout"
                    value={state.data.interactive_timeout} />

                  <TextInput
                    id="v_display_errors"
                    title="v_display_errors"
                    name="v_display_errors"
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
                    name="v_config"
                    id="v_config"
                    rows="25" />

                  <br />

                  <Checkbox
                    title={i18n['restart']}
                    defaultChecked={true}
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