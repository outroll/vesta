import React, { useEffect, useState } from 'react';

import TextInputWithExtraButton from '../../ControlPanel/AddItemLayout/Form/TextInputWithExtraButton/TextInputWithExtraButton';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import SelectInput from '../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import NameServers from '../../ControlPanel/AddItemLayout/Form/NameServers/NameServers';
import { getPackageInfo, updatePackage } from '../../../ControlPanelService/Package';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QS from 'qs';

import './EditPackage.scss';
import { Helmet } from 'react-helmet';

const EditPackage = props => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    loading: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });

    dispatch(addActiveElement('/list/package/'));
    dispatch(removeFocusedElement());

    if (queryParams.package) {
      setState({ ...state, loading: true });

      getPackageInfo(queryParams.package)
        .then(response => {
          setState({
            ...state,
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
    let updatedPackage = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedPackage[name] = value;
    }

    updatedPackage['token'] = token;
    updatedPackage['save'] = 'save';
    updatedPackage['v_package'] = state.data.package;

    if (Object.keys(updatedPackage).length !== 0 && updatedPackage.constructor === Object) {
      setState({ ...state, loading: true });

      updatePackage(updatedPackage, state.data.package)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;
            setState({ ...state, errorMessage: error_msg || '', okMessage: ok_msg || '', loading: false });
            history.push('/list/package/');
          }
        })
        .catch(err => console.error(err));
    }
  }

  const toggleUnlimited = inputName => {
    let inputNameToUpdate = state.data[inputName];
    let defaultValue;

    if (inputName === 'quota' || inputName === 'bandwidth') {
      defaultValue = '1000';
    } else {
      defaultValue = '1';
    }

    setState({
      ...state,
      data: {
        ...state.data,
        [inputName]: inputNameToUpdate !== 'unlimited' ? 'unlimited' : defaultValue
      }
    });
  }

  return (
    <div className="edit-template edit-package">
      <Helmet>
        <title>{`Vesta - ${i18n.PACKAGE}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing Package']}</div>
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
          <form onSubmit={submitFormHandler} id="edit-package">
            <TextInput
              id="domain"
              name="v_domain"
              title={i18n['Package Name']}
              value={state.data.package}
              disabled />

            <SelectInput
              optionalTitle={state.data.web_system}
              options={state.data.web_templates}
              selected={state.data.web_template}
              title={i18n['Web Template']}
              name="v_web_template"
              id="web-templates" />

            {
              state.data.web_backend && (
                <SelectInput
                  optionalTitle={state.data.web_backend}
                  options={state.data.backend_templates}
                  selected={state.data.backend_template}
                  title={i18n['Backend Template']}
                  name="v_backend_template"
                  id="backend-templates" />
              )
            }

            {
              state.data.proxy_system && (
                <SelectInput
                  optionalTitle={state.data.proxy_system}
                  options={state.data.proxy_templates}
                  selected={state.data.proxy_template}
                  title={i18n['Proxy Template']}
                  name="v_proxy_template"
                  id="proxy-templates" />
              )
            }

            {
              state.data.dns_system && (
                <SelectInput
                  optionalTitle={state.data.dns_system}
                  options={state.data.dns_templates}
                  selected={state.data.dns_template}
                  title={i18n['DNS Template']}
                  name="v_dns_template"
                  id="dns-templates" />
              )
            }

            <SelectInput
              options={state.data.shells}
              selected={state.data.shell}
              title={i18n['SSH Access']}
              name="v_shell"
              id="ssh-access" />

            <TextInputWithExtraButton
              title={i18n['Web Domains']}
              id="webDomains"
              name="v_web_domains"
              value={state.data.web_domains}>
              <button type="button" onClick={() => toggleUnlimited('web_domains')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['Web Aliases']}
              optionalTitle={i18n['per domain']}
              id="webAliases"
              name="v_web_aliases"
              value={state.data.web_aliases}>
              <button type="button" onClick={() => toggleUnlimited('web_aliases')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['DNS Domains']}
              id="dnsDomains"
              name="v_dns_domains"
              value={state.data.dns_domains}>
              <button type="button" onClick={() => toggleUnlimited('dns_domains')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['DNS records']}
              optionalTitle={i18n['per domain']}
              id="dnsRecords"
              name="v_dns_records"
              value={state.data.dns_records}>
              <button type="button" onClick={() => toggleUnlimited('dns_records')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['Mail Domains']}
              id="mailDomains"
              name="v_mail_domains"
              value={state.data.mail_domains}>
              <button type="button" onClick={() => toggleUnlimited('mail_domains')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['Mail Accounts']}
              optionalTitle={i18n['per domain']}
              id="mailAccounts"
              name="v_mail_accounts"
              value={state.data.mail_accounts}>
              <button type="button" onClick={() => toggleUnlimited('mail_accounts')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['Databases']}
              id="databases"
              name="v_databases"
              value={state.data.databases}>
              <button type="button" onClick={() => toggleUnlimited('databases')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['Cron Jobs']}
              id="cronJobs"
              name="v_cron_jobs"
              value={state.data.cron_jobs}>
              <button type="button" onClick={() => toggleUnlimited('cron_jobs')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInput name="v_backups" id="backups" value={state.data.backups} title={i18n['Backups']} />

            <TextInputWithExtraButton
              title={i18n['Quota']}
              optionalTitle={i18n['in megabytes']}
              id="quota"
              name="v_disk_quota"
              value={state.data.disk_quota}>
              <button type="button" onClick={() => toggleUnlimited('disk_quota')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <TextInputWithExtraButton
              title={i18n['Bandwidth']}
              optionalTitle={i18n['in megabytes']}
              id="bandwidth"
              name="v_bandwidth"
              value={state.data.bandwidth}>
              <button type="button" onClick={() => toggleUnlimited('bandwidth')}>
                <FontAwesomeIcon icon="infinity" />
              </button>
            </TextInputWithExtraButton>

            <NameServers usersNS={state.data.nameservers} />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/package/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditPackage;