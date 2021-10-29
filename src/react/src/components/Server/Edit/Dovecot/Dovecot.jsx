import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../../actions/MainNavigation/mainNavigationActions";
import Checkbox from '../../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import TextArea from '../../../ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import { getServiceInfo, updateService } from 'src/ControlPanelService/Server';
import AddItemLayout from '../../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../../components/Spinner/Spinner';
import Toolbar from '../../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './Dovecot.scss';
import { Helmet } from 'react-helmet';
import HtmlParser from 'react-html-parser';

const Dovecot = () => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/server/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });

    getServiceInfo('dovecot')
      .then(response => {
        if (!response.data.config) {
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

      updateService(updatedService, '/dovecot')
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
    <div className="edit-template edit-dovecot">
      <Helmet>
        <title>{`Vesta - ${i18n.SERVER}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">
          {i18n['Configuring Server']} / {state.data.service_name}
        </div>
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
          <form onSubmit={event => submitFormHandler(event)} id="edit-dovecot">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextArea
              defaultValue={state.data.config}
              title={state.data.config_path}
              name="v_config"
              id="v_config"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config1}
              title={state.data.config_path1}
              name="v_config1"
              id="v_config1"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config2}
              title={state.data.config_path2}
              name="v_config2"
              id="v_config2"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config3}
              title={state.data.config_path3}
              name="v_config3"
              id="v_config3"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config4}
              title={state.data.config_path4}
              name="v_config4"
              id="v_config4"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config5}
              title={state.data.config_path5}
              name="v_config5"
              id="v_config5"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config6}
              title={state.data.config_path6}
              name="v_config6"
              id="v_config6"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config7}
              title={state.data.config_path7}
              name="v_config7"
              id="v_config7"
              rows="10" />

            <br />

            <TextArea
              defaultValue={state.data.config8}
              title={state.data.config_path8}
              name="v_config8"
              id="v_config8"
              rows="10" />

            <br />

            <Checkbox
              title={i18n['restart']}
              defaultChecked={true}
              name="v_restart"
              id="restart" />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/server/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div >
  );
}

export default Dovecot;