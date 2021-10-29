import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { updateDNS, getDNSRecordInfo } from 'src/ControlPanelService/Dns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QS from 'qs';
import { Helmet } from 'react-helmet';
import { checkAuthHandler } from 'src/actions/Session/sessionActions';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';
import HtmlParser from 'react-html-parser';

export default function EditDNSRecord(props) {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({
    data: {},
    selectOptions: [
      'A',
      'AAAA',
      'NS',
      'CNAME',
      'MX',
      'TXT',
      'SRV',
      'DNSKEY',
      'KEY',
      'IPSECKEY',
      'PTR',
      'SPF',
      'TLSA',
      'CAA'
    ],
    loading: false,
    errorMessage: '',
    okMessage: ''
  });

  useEffect(() => {
    const { domain, record_id } = props;

    dispatch(addActiveElement('/list/dns/'));
    dispatch(removeFocusedElement());

    if (domain) {
      setState({ ...state, loading: true });

      getDNSRecordInfo(domain, record_id)
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
    let updatedRecord = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedRecord[name] = value;
    }

    updatedRecord['v_domain'] = state.data.domain;
    updatedRecord['v_record_id'] = props.record_id;
    updatedRecord['v_type'] = state.data.type;

    if (Object.keys(updatedRecord).length !== 0 && updatedRecord.constructor === Object) {
      setState({ ...state, loading: true });

      updateDNS(updatedRecord, props.domain, props.record_id)
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
    <div className="edit-template edit-dns-rec">
      <Helmet>
        <title>{`Vesta - ${i18n.DNS}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing DNS Record']}</div>
        <div className="error">
          <span className="error-message">
            {state.data.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}
          </span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span>{HtmlParser(state.okMessage)}</span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-dns-rec">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextInput
              title={i18n['Domain']}
              value={props.domain}
              name="v_domain"
              id="domain"
              disabled />

            <TextInput
              value={state.data.rec}
              title={i18n['Record']}
              name="v_record_id"
              id="domain"
              disabled />

            <SelectInput
              options={state.selectOptions}
              selected={state.data.type}
              title={i18n['Type']}
              name="v_type"
              id="type"
              disabled />

            <TextInput
              title={i18n['IP or Value']}
              value={state.data.val}
              name="v_val"
              id="val" />

            <TextInput
              optionalTitle={`(${i18n['optional']})`}
              value={state.data.priority}
              title={i18n['Priority']}
              name="v_priority"
              id="priority" />

            <TextInput
              optionalTitle={`(${i18n['internal']})`}
              title={i18n['Record Number']}
              value={state.data.record_id}
              name="v_priority"
              id="priority" />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push(`/list/dns?domain=${props.domain}`)}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}