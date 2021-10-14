import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from '../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import { getMailInfo, updateMail } from '../../../ControlPanelService/Mail';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QS from 'qs';

import './EditMail.scss';
import { Helmet } from 'react-helmet';

const EditMail = props => {
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
    const { domain } = queryParams;

    dispatch(addActiveElement('/list/mail/'));
    dispatch(removeFocusedElement());

    if (domain) {
      setState({ ...state, loading: true });

      getMailInfo(domain)
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
    let updatedDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedDomain[name] = value;
    }

    updatedDomain['v_domain'] = state.data.domain;

    if (Object.keys(updatedDomain).length !== 0 && updatedDomain.constructor === Object) {
      setState({ ...state, loading: true });

      updateMail(updatedDomain, state.data.domain)
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

  return (
    <div className="edit-template edit-mail">
      <Helmet>
        <title>{`Vesta - ${i18n.MAIL}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing Mail Domain']}</div>
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
          <form onSubmit={event => submitFormHandler(event)} id="edit-mail">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextInput id="domain" name="v_domain" title={i18n['Domain']} value={state.data.domain} disabled />

            <Checkbox
              name="v_antispam"
              id="antispam"
              title={i18n['AntiSpam Support']}
              defaultChecked={state.data.antispam === 'yes'} />

            <Checkbox
              name="v_antivirus"
              id="antivirus"
              title={i18n['AntiVirus Support']}
              defaultChecked={state.data.antivirus === 'yes'} />

            <Checkbox
              name="v_dkim"
              id="dkim"
              title={i18n['DKIM Support']}
              defaultChecked={state.data.dkim === 'yes'} />

            <TextInput id="catchall" name="v_catchall" title={i18n['Catchall email']} value={state.data.catchall} />

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/mail/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditMail;