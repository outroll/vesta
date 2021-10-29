import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { addWeb, getWebStats } from '../../../ControlPanelService/Web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvancedOptions from './AdvancedOptions/AdvancedOptions';
import { getIpList } from '../../../ControlPanelService/Ip';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';

import './AddWebDomain.scss';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const AddWebDomain = props => {
  const { i18n } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    dnsSupport: true,
    mailSupport: true,
    showAdvancedOptions: false,
    okMessage: '',
    domain: '',
    errorMessage: '',
    webStats: [],
    prefixI18N: '',
    internetProtocols: []
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/web/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });
    Promise.all([getWebStats(), getIpList()])
      .then(result => {
        const [webStats, internetProtocols] = result;
        let internetProtocolNames = getInternetProtocolNames(internetProtocols.data.data);

        setState({
          ...state,
          webStats: webStats.data.data,
          internetProtocols: internetProtocolNames,
          prefixI18N: webStats.data.prefixI18N,
          loading: false
        });
      });
  }, []);

  const getInternetProtocolNames = internetProtocols => {
    let result = [];

    for (let i in internetProtocols) {
      result.push(i);
    }

    return result;
  }

  const renderInternetProtocolsOptions = () => {
    return state.internetProtocols.map(ip => <option value={ip}>{ip}</option>);
  }

  const showAdvancedOption = () => {
    setState({ ...state, showAdvancedOptions: !state.showAdvancedOptions });
  }

  const renderAdvancedOptions = () => {
    if (state.showAdvancedOptions) {
      return <AdvancedOptions prefixI18N={state.prefixI18N} domain={state.domain} webStats={state.webStats} />;
    }
  }

  const onBlurChangeAliases = value => {
    setState({ ...state, domain: value });
  }

  const submitFormHandler = event => {
    event.preventDefault();
    let newWebDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newWebDomain[name] = value;
    }

    if (Object.keys(newWebDomain).length !== 0 && newWebDomain.constructor === Object) {
      setState({ loading: true });
      addWeb(newWebDomain)
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
    <div className="edit-template add-web">
      <Helmet>
        <title>{`Vesta - ${i18n.WEB}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding Domain']}</div>
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
        {state.loading ? <Spinner /> : (
          <form onSubmit={event => submitFormHandler(event)}>
            <input type="hidden" name="ok" value="add" />
            <input type="hidden" name="token" value={token} />

            <div className="form-group">
              <label htmlFor="domain">{i18n.Domain}</label>
              <input
                type="text"
                className="form-control"
                id="domain"
                required
                name="v_domain"
                onBlur={event => onBlurChangeAliases(event.target.value)} />
            </div>

            <div class="form-group">
              <label htmlFor="package">{i18n['IP Address']}</label>
              <select class="form-control" id="ip" name="v_ip">
                {renderInternetProtocolsOptions()}
              </select>
            </div>

            <div className="form-group">
              <div className="checkbox-wrapper">
                <input type="checkbox" name="v_dns" id="dns-support" checked={state.dnsSupport} />
                <label htmlFor="dns-support">{i18n['DNS Support']}</label>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-wrapper">
                <input type="checkbox" name="v_mail" id="mail-support" checked={state.mailSupport} />
                <label htmlFor="mail-support">{i18n['Mail Support']}</label>
              </div>
            </div>

            <div className="form-group advanced-options-button">
              <button type="button" onClick={() => showAdvancedOption()}>
                {i18n['Advanced options']}
                {state.showAdvancedOptions ? <FontAwesomeIcon icon="caret-down" /> : <FontAwesomeIcon icon="caret-up" />}
              </button>
            </div>

            {renderAdvancedOptions()}

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add}</button>
              <button type="button" className="back" onClick={() => history.push('/list/web/')}>{i18n.Back}</button>
            </div>
          </form>
        )}
      </AddItemLayout>
    </div>
  );
}

export default AddWebDomain;