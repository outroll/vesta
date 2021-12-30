import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { addWeb, getWebDomainInfo } from '../../../ControlPanelService/Web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdvancedOptions from './AdvancedOptions/AdvancedOptions';
import Checkbox from 'src/components/ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import TextArea from 'src/components/ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';

import './AddWebDomain.scss';
import GenerateSSL from 'src/containers/GenerateCSR';
import 'src/components/Modal/Modal.scss';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const AddWebDomain = props => {
  const { i18n, userName } = useSelector(state => state.session);
  const { panel } = useSelector(state => state.panel);
  const { session } = useSelector(state => state.userSession);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [modalVisible, setModalVisible] = useState(false);
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    dnsSupport: true,
    mailSupport: true,
    proxySupport: true,
    showAdvancedOptions: false,
    okMessage: '',
    ssl_crt: '',
    ssl_key: '',
    domain: '',
    errorMessage: '',
    webStats: [],
    prefixI18N: '',
    prePath: '',
    aliases: '',
    proxy_ext: '',
    internetProtocols: []
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/web/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });
    getWebDomainInfo()
      .then(res => {
        setState({
          ...state,
          internetProtocols: getInternetProtocolNames(res.data.ips),
          webStats: res.data.stats,
          prefixI18N: res.data.prefix,
          proxy_ext: res.data.proxy_ext,
          prePath: res.data.ftp_pre_path,
          loading: false
        });
      })
      .catch(err => {
        setState({ ...state, loading: false });
        console.error(err);
      })
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
      return <AdvancedOptions
        prefixI18N={state.prefixI18N}
        setModalVisible={bool => setModalVisible(bool)}
        sslCertificate={state.ssl_crt}
        sslKey={state.ssl_key}
        domain={state.domain}
        webStats={state.webStats}
        prePath={state.prePath} />;
    }
  }

  const onBlurChangeAliases = value => {
    setState({ ...state, aliases: `www.${value}`});
  }

  const checkboxHandler = (input, checked) => {
    setState({ ...state, [input]: checked });
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

            <div class="form-group">
              <label htmlFor="aliases">{i18n.Aliases}</label>
              <textarea
                class="form-control"
                id="aliases"
                rows="3"
                name="v_aliases"
                defaultValue={state.aliases}
              ></textarea>
            </div>

            {
              panel[userName]['DNS_DOMAINS'] !== '0' && (
                <Checkbox
                  onChange={checked => checkboxHandler('dnsSupport', checked)}
                  name="v_dns"
                  id="dns-support"
                  title={i18n['DNS Support'] ?? 'DNS Support'}
                  defaultChecked={state.dnsSupport} />
              )
            }

            {
              panel[userName]['MAIL_DOMAINS'] !== '0' && (
                <Checkbox
                  onChange={checked => checkboxHandler('mailSupport', checked)}
                  name="v_mail"
                  id="mail-support"
                  title={i18n['Mail Support'] ?? 'Mail Support'}
                  defaultChecked={state.mailSupport} />
              )
            }

            {
              session.PROXY_SYSTEM && (
                <>
                  <Checkbox
                    onChange={checked => checkboxHandler('proxySupport', checked)}
                    name="v_proxy"
                    id="proxy"
                    title={i18n['Proxy Support'] ?? 'Proxy Support'}
                    defaultChecked={state.proxySupport} />

                  {
                    state.proxySupport && (<div style={{ transform: 'translateX(3rem)' }}>
                      <TextArea
                        id="proxy-extensions"
                        name="v_proxy_ext"
                        title={i18n['Proxy Extensions']}
                        defaultValue={state.proxy_ext} />
                    </div>)
                  }
                </>
              )
            }

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
      <div className={`modal fade ${modalVisible ? 'show' : ''}`} id="c-panel-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: modalVisible ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{i18n['Generating CSR']}</h5>
              <button type="button" onClick={() => setModalVisible(false)} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <GenerateSSL
              domain={state.domain}
              closeModal={() => setModalVisible(false)}
              prePopulateInputs={({ crt, key }) => {
                setState({ ...state, ssl_crt: crt, ssl_key: key });
                setModalVisible(false);
              }} />
          </div>
        </div>
      </div>
    </div >
  );
}

export default AddWebDomain;
