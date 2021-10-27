import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Password from '../../../../components/ControlPanel/AddItemLayout/Form/Password/Password';

import './AdditionalFtpForEditing.scss';

const AdditionalFtpForEditing = ({ domain, data = {}, onDeleteAdditionalFtp, prefixI18N, prePath, checked, ...props }) => {
  const { i18n, userName } = useSelector(state => state.session);
  const [state, setState] = useState({
    username: data.v_ftp_user || '',
    path: ''
  });

  const renderForm = () => {
    if (data.deleted) {
      if (data.is_new === 0) {
        return (<>
          <input type="hidden" name={`v_ftp_user[${data.id}][delete]`} value="1" />
          <input type="hidden" name={`v_ftp_user[${data.id}][is_new]`} value={data.is_new} />
          <input type="hidden" name={`v_ftp_user[${data.id}][v_ftp_user]`} value={data.v_ftp_user} />
          <input type="hidden" name={`v_ftp_user[${data.id}][v_ftp_password]`} value={data.v_ftp_password} />
          <input type="hidden" name={`v_ftp_user[${data.id}][v_ftp_path]`} value={data.v_ftp_path} />
          <input type="hidden" name={`v_ftp_user[${data.id}][v_ftp_pre_path]`} value={prePath} />
        </>);
      }
    } else {
      if (!checked) {
        return <></>;
      }

      return (
        <div className="additional-ftp">
          <div className="title">
            <input type="hidden" name={`v_ftp_user[${data.id}][delete]`} value="0" />
            <input type="hidden" name={`v_ftp_user[${data.id}][is_new]`} value="1" />

            <span className="data.indexed-name">{i18n.FTP} #{data.id + 1}</span>
            <span>
              &nbsp;
              <button
                type="button"
                onClick={() => onDeleteAdditionalFtp(data.id)}>
                ({i18n.Delete ?? 'Delete'})
              </button>
            </span>
          </div>

          <div className="form-transform">
            <div className="form-group username">
              <label htmlFor={`ftp_user_${data.id}`}>{i18n.Username}</label>
              <span className="prefix-note">{prefixI18N}</span>
              <div className="input-wrapper">
                <input
                  defaultValue={state.username}
                  onChange={event => setState({ ...state, username: event.target.value })}
                  type="text"
                  disabled={data.v_ftp_user}
                  className="form-control"
                  id={`ftp_user_${data.id}`}
                  name={`v_ftp_user[${data.id}][v_ftp_user]`} />
                <span>{data.v_ftp_user ? data.v_ftp_user : `${userName}_${state.username}`}</span>
              </div>
            </div>

            <Password name={`v_ftp_user[${data.id}][v_ftp_password]`} id={data.id} />

            <div className="form-group">
              <input type="hidden" name="v_ftp_pre_path" value={prePath} />
              <input type="hidden" name={`v_ftp_user[${data.id}][v_ftp_path_prev]`} value={data.v_ftp_path !== '/' ? '/' : ''} />

              <label htmlFor={`path${data.id}`}>{i18n.Path}</label>
              <input
                type="text"
                value={state.path}
                onChange={event => setState({ ...state, path: event.target.value })}
                className="form-control"
                id={`path${data.id}`}
                name={`v_ftp_user[${data.id}][v_ftp_path]`} />
              <span className="path-note">{prePath}</span>
            </div>

            {
              data.is_new === 1 && (
                <div className="form-group">
                  <label htmlFor={`sendLoginCredentialsToEmailAddress_${data.id}`}>{i18n['Send login credentials to email address']}</label>
                  <input
                    type="email"
                    className="form-control"
                    id={`sendLoginCredentialsToEmailAddress_${data.id}`}
                    defaultValue={data.v_ftp_email}
                    name={`v_ftp_user[${data.id}][v_ftp_email]`} />
                </div>
              )
            }

          </div>
        </div >);
    }

    return <></>;
  }

  return renderForm();
}

export default AdditionalFtpForEditing;
