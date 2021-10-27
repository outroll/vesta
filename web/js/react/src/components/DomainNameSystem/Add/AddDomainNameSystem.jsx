import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { getUserNS } from '../../../ControlPanelService/UserNS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';

import './AddDomainNameSystem.scss';
import AdvancedOptions from './AdvancedOptions/AdvancedOptions';
import { addDomainNameSystem } from '../../../ControlPanelService/Dns';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const AddDomainNameSystem = props => {
  const { i18n } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    showAdvancedOptions: false,
    okMessage: '',
    domain: '',
    errorMessage: '',
    userNS: []
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/dns/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });
    getUserNS()
      .then(result => {
        if (result.data.length) {
          setState({ ...state, userNS: result.data, loading: false });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let domainNameSystem = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      domainNameSystem[name] = value;
    }

    if (Object.keys(domainNameSystem).length !== 0 && domainNameSystem.constructor === Object) {
      setState({ ...state, loading: true });
      addDomainNameSystem(domainNameSystem)
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

  const renderAdvancedOptions = () => {
    if (state.showAdvancedOptions) {
      return <AdvancedOptions prefixI18N={state.prefixI18N} userNS={state.userNS} domain={state.domain} webStats={state.webStats} />;
    }
  }

  const showAdvancedOption = () => {
    setState({ ...state, showAdvancedOptions: !state.showAdvancedOptions });
  }

  return (
    <div className="edit-template add-dns">
      <Helmet>
        <title>{`Vesta - ${i18n.DNS}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding DNS Domain'] ?? 'Adding DNS Domain'}</div>
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
              <label htmlFor="domain">{i18n.Domain ?? 'Domain'}</label>
              <input
                type="text"
                className="form-control"
                id="domain"
                required
                name="v_domain" />
            </div>

            <div className="form-group">
              <label htmlFor="ip_address">{i18n['IP address'] ?? 'IP address'}</label>
              <input
                type="text"
                className="form-control"
                id="ip_address"
                required
                name="v_ip" />
            </div>

            <div className="form-group advanced-options-button">
              <button type="button" onClick={() => showAdvancedOption()}>
                {i18n['Advanced options'] ?? 'Advanced options'}
                {state.showAdvancedOptions ? <FontAwesomeIcon icon="caret-down" /> : <FontAwesomeIcon icon="caret-up" />}
              </button>
            </div>

            {renderAdvancedOptions()}

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add ?? 'Add'}</button>
              <button type="button" className="back" onClick={() => history.push('/list/dns/')}>{i18n.Back ?? 'Back'}</button>
            </div>
          </form>
        )}
      </AddItemLayout>
    </div>
  );
}

export default AddDomainNameSystem;