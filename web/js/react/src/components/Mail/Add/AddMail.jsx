import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addMail } from '../../../ControlPanelService/Mail';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch } from 'react-redux';

import './AddMail.scss'
import { Helmet } from 'react-helmet';

const AddMail = props => {
  const { i18n } = window.GLOBAL.App;
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const history = useHistory();
  const [state, setState] = useState({
    loading: false,
    antiSpamChecked: true,
    antiVirusChecked: true,
    dkimChecked: true,
    okMessage: '',
    errorMessage: '',
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/mail/'));
    dispatch(removeFocusedElement());
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let newMailDomain = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newMailDomain[name] = value;
    }

    if (Object.keys(newMailDomain).length !== 0 && newMailDomain.constructor === Object) {
      addMail(newMailDomain)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '' });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg });
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="edit-template add-web">
      <Helmet>
        <title>{`Vesta - ${i18n.MAIL}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding Mail Domain']}</div>
        <div className="error">
          <span className="error-message">
            {state.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            {state.errorMessage}</span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span>
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
              <input type="text" className="form-control" id="domain" name="v_domain" />
            </div>

            <div className="form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="v_antispam"
                  id="antispam-support"
                  onChange={event => setState({ ...state, antiSpamChecked: event.target.checked })}
                  checked={state.antiSpamChecked} />
                <label htmlFor="antispam-support">{i18n['AntiSpam Support']}</label>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="v_antivirus"
                  id="antivirus-support"
                  onChange={event => setState({ ...state, antiVirusChecked: event.target.checked })}
                  checked={state.antiVirusChecked} />
                <label htmlFor="antivirus-support">{i18n['AntiVirus Support']}</label>
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="v_dkim"
                  id="dkim-support"
                  onChange={event => setState({ ...state, dkimChecked: event.target.checked })}
                  checked={state.dkimChecked} />
                <label htmlFor="dkim-support">{i18n['DKIM Support']}</label>
              </div>
            </div>

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add}</button>
              <button type="button" className="back" onClick={() => history.push('/list/mail/')}>{i18n.Back}</button>
            </div>
          </form>
        )}
      </AddItemLayout>
    </div>
  );
}

export default AddMail;