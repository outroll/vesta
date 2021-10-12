import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { addInternetProtocol, getAdditionalInfo } from '../../../ControlPanelService/Ip';
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from '../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';

import './AddInternetProtocol.scss';
import { Helmet } from 'react-helmet';

const AddInternetProtocol = props => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;
  const session = useSelector(state => state.session);
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    dedicated: true,
    okMessage: '',
    errorMessage: '',
    interfaces: [],
    users: []
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/ip/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });

    fetchData();
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let newIp = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newIp[name] = value;
    }

    if (Object.keys(newIp).length !== 0 && newIp.constructor === Object) {
      setState({ ...state, loading: true });

      addInternetProtocol(newIp)
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

  const fetchData = () => {
    getAdditionalInfo()
      .then(result => {
        setState({ ...state, interfaces: result.data.interfaces, users: result.data.users, loading: false });
      })
      .catch(err => console.error(err));
  }

  const onChangeDedicated = value => {
    setState({ ...state, dedicated: value });
  }

  return (
    <div className="edit-template add-ip">
      <Helmet>
        <title>{`Vesta - ${i18n.IP}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding Package']}</div>
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
            <input type="hidden" name="v_owner" value={session.userName} />
            <input type="hidden" name="token" value={token} />

            <TextInput name="v_ip" id="ipAddress" title={i18n['IP address']} />

            <TextInput name="v_netmask" id="netmask" title={i18n['Netmask']} />

            <SelectInput
              options={state.interfaces}
              name="v_interface"
              id="interfaces"
              title={i18n['Interface']} />

            <Checkbox onChange={onChangeDedicated} name="v_shared" id="shared" title={i18n['Shared']} defaultChecked={state.dedicated} />

            {
              !state.dedicated
                ? (
                  <div className="assigned-user">
                    <SelectInput
                      options={state.users}
                      name="v_owner"
                      id="users"
                      title={i18n['Assigned user']} />
                  </div>
                )
                : null
            }

            <TextInput name="v_name" id="name" title={i18n['Assigned domain']} optionalTitle={i18n['optional']} />

            <TextInput name="v_nat" id="nat" title={i18n['NAT IP association']} optionalTitle={i18n['optional']} />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add}</button>
              <button type="button" className="back" onClick={() => history.push('/list/ip/')}>{i18n.Back}</button>
            </div>
          </form>
        )}
      </AddItemLayout>
    </div>
  );
}

export default AddInternetProtocol;