import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../../actions/MainNavigation/mainNavigationActions";
import TextInput from '../../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from '../../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import TextArea from '../../../ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import AddItemLayout from '../../../ControlPanel/AddItemLayout/AddItemLayout';
import { getServiceInfo, updateService } from 'src/ControlPanelService/Server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../../components/Spinner/Spinner';
import Toolbar from '../../../MainNav/Toolbar/Toolbar';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './EditServerNginx.scss';
import { Helmet } from 'react-helmet';
import HtmlParser from 'react-html-parser';

const EditServerNginx = props => {
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

    setState({ ...state, loading: true });

    getServiceInfo('nginx')
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
    let updatedService = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedService[name] = value;
    }

    if (Object.keys(updatedService).length !== 0 && updatedService.constructor === Object) {
      setState({ ...state, loading: true });

      updateService(updatedService, '/nginx')
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
    <div className="edit-template edit-nginx">
      <Helmet>
        <title>{`Vesta - ${i18n.SERVER}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Configuring Server']} / {state.data.service_name}</div>
        <div className="link"><Link to="/edit/server/php">{i18n['Configure']} php.ini</Link></div>
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
          <form onSubmit={event => submitFormHandler(event)} id="edit-mail">
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
                    id="worker_processes"
                    title="worker_processes"
                    name="v_worker_processes"
                    value={state.data.worker_processes} />

                  <TextInput
                    id="worker_connections"
                    title="worker_connections"
                    name="v_worker_connections"
                    value={state.data.worker_connections} />

                  <TextInput
                    id="client_max_body_size"
                    title="client_max_body_size"
                    name="v_client_max_body_size"
                    value={state.data.client_max_body_size} />

                  <TextInput
                    id="send_timeout"
                    title="send_timeout"
                    name="v_send_timeout"
                    value={state.data.send_timeout} />

                  <TextInput
                    id="proxy_connect_timeout"
                    title="proxy_connect_timeout"
                    name="v_proxy_connect_timeout"
                    value={state.data.proxy_connect_timeout} />

                  <TextInput
                    id="proxy_send_timeout"
                    title="proxy_send_timeout"
                    name="v_proxy_send_timeout"
                    value={state.data.proxy_send_timeout} />

                  <TextInput
                    id="proxy_read_timeout"
                    title="proxy_read_timeout"
                    name="v_proxy_read_timeout"
                    value={state.data.proxy_read_timeout} />

                  <TextInput
                    id="gzip"
                    title="gzip"
                    name="v_gzip"
                    value={state.data.gzip} />

                  <TextInput
                    id="gzip_comp_level"
                    title="gzip_comp_level"
                    name="v_gzip_comp_level"
                    value={state.data.gzip_comp_level} />

                  <TextInput
                    id="charset"
                    title="charset"
                    name="v_charset"
                    value={state.data.charset} />
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

export default EditServerNginx;