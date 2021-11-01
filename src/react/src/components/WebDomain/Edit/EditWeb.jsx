import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import { updateWebDomain, getDomainInfo } from '../../../ControlPanelService/Web';
import Password from '../../../components/ControlPanel/AddItemLayout/Form/Password/Password';
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import AdditionalFtpWrapper from '../Add/AdditionalFtpWrapper/AdditionalFtpWrapper';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from '../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import SslSupport from './SslSupport/SslSupport';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GenerateSSL from 'src/containers/GenerateCSR';
import 'src/components/Modal/Modal.scss';
import QS from 'qs';

import './EditWeb.scss';
import TextArea from '../../ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

const EditWeb = props => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const { session } = useSelector(state => state.userSession);
  const history = useHistory();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [okMessage, setOkMessage] = useState('');
  const [state, setState] = useState({
    data: {},
    domain: '',
    webStat: '',
    sslSupport: false,
    letsEncrypt: false,
    additionalFtp: false,
    proxySupport: false,
    statAuth: false,
    loading: false
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { domain } = queryParams;

    dispatch(addActiveElement('/list/web/'));
    dispatch(removeFocusedElement());

    if (domain) {
      setState({ ...state, loading: true });
      fetchData(domain);
    }
  }, []);

  const fetchData = domain => {
    getDomainInfo(domain)
      .then(response => {
        setState({
          ...state,
          domain,
          webStat: response.data.v_stats ? response.data.v_stats : 'none',
          sslSupport: response.data.ssl === 'yes',
          letsEncrypt: response.data.letsencrypt === 'yes',
          proxySupport: !!response.data.proxy,
          data: response.data,
          additionalFtp: !!response.data.ftp_user,
          statAuth: response.data.stats_user,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedDomain[name] = value;
    }

    updatedDomain['v_domain'] = state.domain;

    if (updatedDomain['v_ssl'] === 'on') {
      updatedDomain['v_ssl'] = 'yes';
    } else {
      delete updatedDomain['v_ssl'];
    }

    if (updatedDomain['v_letsencrypt'] === 'on') {
      updatedDomain['v_letsencrypt'] = 'yes';
    } else {
      delete updatedDomain['v_letsencrypt'];
    }

    if (!updatedDomain['v_ssl_ca']) {
      delete updatedDomain['v_ssl_ca'];
    }

    if (!updatedDomain['v_ssl_crt']) {
      delete updatedDomain['v_ssl_crt'];
    }

    if (!updatedDomain['v_ssl_key']) {
      delete updatedDomain['v_ssl_key'];
    }

    if (Object.keys(updatedDomain).length !== 0 && updatedDomain.constructor === Object) {
      setState({ ...state, loading: true });

      updateWebDomain(updatedDomain, state.domain)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setErrorMessage(error_msg);
              setOkMessage('');
              setState({ ...state, loading: false });
            } else {
              dispatch(refreshCounters()).then(() => {
                setErrorMessage('');
                setOkMessage(ok_msg);
                fetchData(state.domain);
              });
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  const formatData = object => {
    let result = [];

    for (let i in object) {
      result.push(i);
    }

    return result;
  }

  const onChangeSslSupport = checked => {
    setState({ ...state, sslSupport: checked });
  }

  const onChangeProxySupport = checked => {
    setState({ ...state, proxySupport: checked });
  }

  const onChangeWebStats = webStat => {
    setState({ ...state, webStat });
  }

  const onChangeStatisticsAuth = statAuth => {
    setState({ ...state, statAuth });
  }

  const onChangeAdditionalFtp = additionalFtp => {
    setState({ ...state, additionalFtp });
  }

  return (
    <div className="edit-template edit-web">
      <Helmet>
        <title>{`Vesta - ${i18n.WEB}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing Domain']}</div>
        <div className="error"><span className="error-message">{errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {errorMessage}</span></div>
        <div className="success">
          <span className="ok-message">{okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span>{HtmlParser(okMessage)}</span> </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="add-web">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextInput id="domain" name="v_domain" title={i18n['Domain']} value={state.domain} disabled />

            <SelectInput
              options={formatData(state.data.ips)}
              selected={state.data.ip}
              name="v_ip"
              id="ip"
              title={i18n['IP Address']} />

            <TextArea
              id="proxy-aliases"
              name="v_aliases"
              title={i18n['Aliases']}
              defaultValue={state.data.aliases} />

            <SelectInput
              options={state.data.templates}
              selected={state.data.template}
              name="v_template"
              id="web-template"
              optionalTitle={state.data.web_system}
              title={i18n['Web Template']} />

            {
              session.WEB_BACKEND && (
                <SelectInput
                  options={state.data.backend_templates}
                  selected={state.data.backend_template || 'default'}
                  name="v_backend_template"
                  id="backend-template"
                  optionalTitle={state.data.web_backend}
                  title={i18n['Backend Template']} />
              )
            }

            {
              state.data.proxy_system && (
                <>
                  <Checkbox
                    onChange={onChangeProxySupport}
                    name="v_proxy"
                    id="proxy"
                    title={i18n['Proxy Support'] ?? 'Proxy Support'}
                    defaultChecked={state.proxySupport} />

                  {
                    state.proxySupport && (<div style={{ transform: 'translateX(3rem)' }}>
                      <SelectInput
                        options={state.data.proxy_templates}
                        selected={state.data.proxy_template || 'default'}
                        optionalTitle={state.data.proxy_system}
                        name="v_proxy_template"
                        id="proxy_template"
                        title={i18n['Proxy Template']} />

                      <TextArea
                        id="proxy-extensions"
                        name="v_proxy_ext"
                        title={i18n['Proxy Extensions']}
                        defaultValue={state.data.proxy_ext} />
                    </div>)
                  }
                </>
              )
            }

            <Checkbox
              onChange={onChangeSslSupport}
              name="v_ssl"
              id="ssl-support"
              title={i18n['SSL Support'] ?? 'SSL Support'}
              defaultChecked={state.sslSupport} />

            {
              state.sslSupport && (
                <SslSupport
                  sslSubject={state.data.ssl_subject}
                  sslAliases={state.data.ssl_aliases}
                  sslNotBefore={state.data.ssl_not_before}
                  sslNotAfter={state.data.ssl_not_after}
                  sslSignature={state.data.ssl_signature}
                  sslPubKey={state.data.ssl_pub_key}
                  sslIssuer={state.data.ssl_issuer}
                  sslCertificate={state.data.ssl_crt}
                  sslKey={state.data.ssl_key}
                  setModalVisible={bool => setModalVisible(bool)}
                  sslCertificateAuthority={state.data.ssl_ca}
                  domain={state.domain}
                  sslHome={state.data.ssl_home}
                  letsEncrypt={state.letsEncrypt}
                />
              )
            }

            <SelectInput
              options={state.data.stats}
              selected={state.webStat}
              title={i18n['Web Statistics']}
              onChange={onChangeWebStats}
              name="v_stats"
              id="stats" />

            {
              state.webStat !== 'none' && (
                <div className="web-stat-additional">
                  <Checkbox
                    onChange={onChangeStatisticsAuth}
                    name="v_stats_auth"
                    id="stat-auth"
                    defaultChecked={state.data.stats_user}
                    title={i18n['Statistics Authorization']} />

                  {
                    state.statAuth && (
                      <>
                        <TextInput id="domain" name="v_stats_user" title={i18n['Username']} value={state.data.stats_user} />

                        <Password name='v_stats_password' />
                      </>
                    )
                  }
                </div>
              )
            }

            <Checkbox
              onChange={onChangeAdditionalFtp}
              name="v_ftp"
              id="add-ftp"
              checked={state.additionalFtp}
              title={i18n['Additional FTP Account']} />

            <AdditionalFtpWrapper
              checked={state.additionalFtp}
              prefixI18N={state.data.prefixI18N}
              ftps={state.data.ftp_users}
              ftpUserPrePath={state.data.ftp_user_prepath}
              unCheckAdditionalFtpBox={() => onChangeAdditionalFtp(false)} />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/web/')}>{i18n.Back}</button>
            </div>

          </form>
        }
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
                setState({ ...state, data: { ...state.data, ssl_crt: crt, ssl_key: key } });
                setModalVisible(false);
              }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditWeb;
