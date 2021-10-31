import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { getFirewallInfo, updateFirewall } from '../../../ControlPanelService/Firewalls';
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QS from 'qs';

import './EditFirewall.scss';
import { Helmet } from 'react-helmet';
import HtmlParser from 'react-html-parser';

const EditFirewall = props => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [okMessage, setOkMessage] = useState('');
  const [state, setState] = useState({
    data: {},
    loading: false
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { rule } = queryParams;

    dispatch(addActiveElement('/list/firewall/'));
    dispatch(removeFocusedElement());

    if (rule) {
      setState({ ...state, loading: true });
      fetchData(rule);
    }
  }, []);

  const fetchData = rule => {
    getFirewallInfo(rule)
      .then(response => {
        setState({
          ...state,
          data: response.data,
          loading: false
        });
      })
      .catch(err => {
        setState({ ...state, loading: false });
        console.error(err);
      });
  }

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedDomain[name] = value;
    }

    if (Object.keys(updatedDomain).length !== 0 && updatedDomain.constructor === Object) {
      setState({ ...state, loading: true });

      updateFirewall(updatedDomain, state.data.rule)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            setErrorMessage(error_msg || '');
            setOkMessage(ok_msg || '');
          }
        })
        .then(() => fetchData(state.data.rule))
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="edit-template edit-firewall">
      <Helmet>
        <title>{`Vesta - ${i18n.FIREWALL}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing Firewall Rule']}</div>
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
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-firewall">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <div className="form-group select-group">
              <label className="label-wrapper" htmlFor="action">
                {i18n['Action']}
              </label>
              <select className="form-control" id="action" name="v_action">
                <option selected={state.data.action === 'DROP'} value="DROP">DROP</option>
                <option selected={state.data.action === 'ACCEPT'} value="ACCEPT">ACCEPT</option>
              </select>
            </div>

            <div className="form-group select-group">
              <label className="label-wrapper" htmlFor="protocol">
                {i18n['Protocol']}
              </label>
              <select className="form-control" id="protocol" name="v_protocol">
                <option selected={state.data.protocol === 'TCP'} value="TCP">{i18n['TCP']}</option>
                <option selected={state.data.protocol === 'UDP'} value="UDP">{i18n['UDP']}</option>
                <option selected={state.data.protocol === 'ICMP'} value="ICMP">{i18n['ICMP']}</option>
              </select>
            </div>

            <TextInput
              optionalTitle={i18n['ranges are acceptable']}
              value={state.data.port}
              title={i18n['Port']}
              name="v_port"
              id="port" />

            <TextInput
              optionalTitle={i18n['CIDR format is supported']}
              value={state.data.ip}
              title={i18n['IP address']}
              name="v_ip"
              id="ip" />

            <TextInput
              optionalTitle={i18n['optional']}
              value={state.data.comment}
              title={i18n['Comment']}
              name="v_comment"
              id="comment" />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/firewall/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditFirewall;