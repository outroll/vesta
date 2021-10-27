import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { addFirewall } from '../../../ControlPanelService/Firewalls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './AddFirewall.scss';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const AddFirewall = props => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    actions: [
      i18n['DROP'],
      i18n['ACCEPT']
    ],
    protocols: [
      i18n['TCP'],
      i18n['UDP'],
      i18n['ICMP']
    ],
    okMessage: '',
    errorMessage: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/firewall/'));
    dispatch(removeFocusedElement());
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let newFirewall = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newFirewall[name] = value;
    }

    if (Object.keys(newFirewall).length !== 0 && newFirewall.constructor === Object) {
      setState({ ...state, loading: true });
      addFirewall(newFirewall)
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

  return (
    <div className="edit-template add-firewall">
      <Helmet>
        <title>{`Vesta - ${i18n.FIREWALL}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding Firewall Rule']}</div>
        <div className="error">
          <span className="error-message">
            {state.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            {state.errorMessage}</span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            <span>{HtmlParser(state.okMessage)}</span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout>
        <form onSubmit={event => submitFormHandler(event)}>
          <input type="hidden" name="ok" value="add" />
          <input type="hidden" name="token" value={token} />

          <SelectInput
            options={state.actions}
            name="v_action"
            id="action"
            title={i18n['Action']} />

          <SelectInput
            options={state.protocols}
            name="v_protocol"
            id="protocol"
            title={i18n['Protocol']} />

          <TextInput
            name="v_port"
            id="port"
            title={i18n['Port']}
            optionalTitle={i18n['ranges are acceptable']} />

          <TextInput
            name="v_ip"
            id="ip"
            title={i18n['IP address']}
            optionalTitle={i18n['CIDR format is supported']} />

          <TextInput
            name="v_comment"
            id="comment"
            title={i18n['Comment']}
            optionalTitle={i18n['optional']} />

          <div className="buttons-wrapper">
            <button type="submit" className="add">{i18n.Add}</button>
            <button type="button" className="back" onClick={() => history.push('/list/firewall/')}>{i18n.Back}</button>
          </div>
        </form>
      </AddItemLayout>
    </div>
  );
}

export default AddFirewall;