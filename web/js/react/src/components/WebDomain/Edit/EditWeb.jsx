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
import { useDispatch } from 'react-redux';
import QS from 'qs';

import './EditWeb.scss';
import TextArea from '../../ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import { Helmet } from 'react-helmet';

const EditWeb = props => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    domain: '',
    webStat: '',
    sslSupport: false,
    letsEncrypt: false,
    additionalFtp: true,
    statAuth: false,
    loading: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { domain } = queryParams;

    dispatch(addActiveElement('/list/web/'));
    dispatch(removeFocusedElement());

    if (domain) {
      setState({ ...state, loading: true });

      getDomainInfo(domain)
        .then(response => {
          setState({
            ...state,
            domain,
            webStat: response.data.v_stats ? response.data.v_stats : 'none',
            sslSupport: response.data.ssl === 'yes',
            letsEncrypt: response.data.letsencrypt === 'yes',
            data: response.data,
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
    let updatedDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedDomain[name] = value;
    }

    updatedDomain['v_domain'] = state.domain;

    if (Object.keys(updatedDomain).length !== 0 && updatedDomain.constructor === Object) {
      setState({ ...state, loading: true });

      updateWebDomain(updatedDomain, state.domain)
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
        <div className="error"><span className="error-message">{state.data.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}</span></div>
        <div className="success">
          <span className="ok-message">{state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span> </span>
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
              value={state.data.aliases} />

            <SelectInput
              options={state.data.templates}
              selected={state.data.template}
              name="v_template"
              id="web-template"
              optionalTitle={state.data.web_system}
              title={i18n['Web Template']} />

            {
              state.data.web_backend
              && (
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
              state.data.proxy_system
              && (
                <SelectInput
                  options={state.data.proxy_templates}
                  selected={state.data.proxy_template || 'default'}
                  optionalTitle={state.data.proxy_system}
                  name="v_proxy_template"
                  id="proxy_template"
                  title={i18n['Proxy Template']} />
              )
            }

            <TextArea
              id="proxy-extensions"
              name="v_proxy_ext"
              title={i18n['Proxy Extensions']}
              defaultValue={state.data.proxy_ext} />

            <Checkbox
              onChange={onChangeSslSupport}
              name="v_shared"
              id="ssl-support"
              title={i18n['SSL Support'] ?? 'SSL Support'}
              defaultChecked={state.sslSupport} />

            {
              state.sslSupport
              && (
                <SslSupport
                  sslSubject={state.data.ssl_subject}
                  sslAliases={state.data.ssl_aliases}
                  sslNotBefore={state.data.ssl_not_before}
                  sslNotAfter={state.data.ssl_not_after}
                  sslSignature={state.data.ssl_signature}
                  sslPubKey={state.data.ssl_pub_key}
                  sslIssuer={state.data.ssl_issuer}
                  sslCertificate={state.data.ssl_crt}
                  sslKey={state.data.key}
                  sslCertificateAuthority={state.data.ca}
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
              state.webStat !== 'none'
              && (
                <div className="web-stat-additional">
                  <Checkbox
                    onChange={onChangeStatisticsAuth}
                    name="v_stats_auth"
                    id="stat-auth"
                    defaultChecked={state.data.stats_user}
                    title={i18n['Statistics Authorization']} />

                  {
                    state.statAuth
                    && (
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
              defaultChecked={!!state.data.ftp_user}
              title={i18n['Additional FTP Account']} />

            {
              state.additionalFtp
              && (
                <AdditionalFtpWrapper prefixI18N={state.data.prefixI18N} ftps={state.data.ftp_users} unCheckAdditionalFtpBox={() => onChangeAdditionalFtp(false)} />
              )
            }

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/web/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditWeb;