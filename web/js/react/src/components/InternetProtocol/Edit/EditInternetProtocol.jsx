import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { getInternetProtocolInfo, updateInternetProtocol } from '../../../ControlPanelService/Ip';
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from '../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QS from 'qs';

import './EditInternetProtocol.scss';
import { Helmet } from 'react-helmet';

const EditInternetProtocol = () => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
    dedicated: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { ip } = queryParams;

    dispatch(addActiveElement('/list/ip/'));
    dispatch(removeFocusedElement());

    if (ip) {
      setState({ ...state, loading: true });

      getInternetProtocolInfo(ip)
        .then(response => {
          setState({
            ...state,
            data: response.data,
            dedicated: !response.data.dedicated,
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
    let updatedIP = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedIP[name] = value;
    }

    updatedIP['token'] = token;
    updatedIP['save'] = 'save';
    updatedIP['v_ip'] = state.data.database;

    if (Object.keys(updatedIP).length !== 0 && updatedIP.constructor === Object) {
      setState({ ...state, loading: true });

      updateInternetProtocol(updatedIP, state.data.ip)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;
            setState({ ...state, errorMessage: error_msg || '', okMessage: ok_msg || '', loading: false });
          }
        })
        .catch(err => console.error(err));
    }
  }

  const onChangeDedicated = value => {
    setState({ ...state, dedicated: value });
  }

  return (
    <div className="edit-template edit-ip">
      <Helmet>
        <title>{`Vesta - ${i18n.IP}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing IP Address']}</div>
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
          <form onSubmit={event => submitFormHandler(event)} id="edit-ip">
            <TextInput id="type" name="v_ip" title={i18n['IP address']} value={state.data.ip} disabled />

            <TextInput id="type" name="v_netmask" title={i18n['Netmask']} value={state.data.netmask} disabled />

            <TextInput id="type" name="v_interface" title={i18n['Interface']} value={state.data.interface} disabled />

            <Checkbox onChange={onChangeDedicated} name="v_shared" id="shared" title={i18n['Shared']} defaultChecked={state.dedicated} />

            {
              !state.dedicated && (
                <div className="dedicated-form-group">
                  <SelectInput
                    options={state.data.users}
                    selected={state.data.owner}
                    title={i18n['Assigned user']}
                    name="v_owner"
                    id="owner" />
                </div>
              )
            }

            <TextInput id="type" name="v_name" title={i18n['Assigned domain']} value={state.data.name} optionalTitle={i18n['optional']} />

            <TextInput id="type" name="v_nat" title={i18n['NAT IP association']} value={state.data.nat} optionalTitle={i18n['optional']} />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/ip/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditInternetProtocol;