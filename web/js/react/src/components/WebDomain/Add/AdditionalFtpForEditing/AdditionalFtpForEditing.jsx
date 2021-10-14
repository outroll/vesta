import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Password from '../../../../components/ControlPanel/AddItemLayout/Form/Password/Password';

import './AdditionalFtpForEditing.scss';

const AdditionalFtpForEditing = ({ domain, data = {}, index, onDeleteAdditionalFtp, prefixI18N }) => {
  const { i18n } = window.GLOBAL.App;
  const { user } = useSelector(state => state.session);
  const [state, setState] = useState({
    username: '',
    path: ''
  });

  return (
    <div className="additional-ftp">
      <div className="title">
        <input type="hidden" name={`v_ftp_user[${index}][delete]`} value="0" />
        <input type="hidden" name={`v_ftp_user[${index}][is_new]`} value={data.is_new} />

        <span className="indexed-name">{i18n.FTP} #{index + 1}</span>
        <span>
          &nbsp;
          <button type="button" onClick={() => onDeleteAdditionalFtp(index)}>({i18n.Delete ?? 'Delete'})</button>
        </span>
      </div>

      <div className="form-transform">
        <div className="form-group username">
          <label htmlFor={`ftp_user_${index}`}>{i18n.Username}</label>
          <span className="prefix-note">{prefixI18N}</span>
          <div className="input-wrapper">
            <input
              defaultValue={state.username}
              onChange={event => setState({ ...state, username: event.target.value })}
              type="text"
              className="form-control"
              id={`ftp_user_${index}`}
              name={`v_ftp_user[${index}][v_ftp_user]`} />
            <span>{user + '_'}{state.username}</span>
          </div>
        </div>

        <Password name={`v_ftp_user[${index}][v_ftp_password]`} id={index} />

        <div className="form-group">
          <input type="hidden" name="v_ftp_pre_path" value={data.v_ftp_pre_path ? data.v_ftp_pre_path : '/'} />
          <input type="hidden" name={`v_ftp_user[${index}][v_ftp_path_prev]`} value={data.v_ftp_path != '/' ? '/' : ''} />

          <label htmlFor={`path${index}`}>{i18n.Path}</label>
          <input
            type="text"
            value={state.path}
            onChange={event => setState({ ...state, path: event.target.value })}
            className="form-control"
            id={`path${index}`}
            name={`v_ftp_user[${index}][v_ftp_path]`} />
          <span className="path-note">{`${data.v_ftp_pre_path ? data.v_ftp_pre_path : ''}/${state.path}`}</span>
        </div>

        {
          data.is_new === 1
          && (
            <div className="form-group">
              <label htmlFor={`sendLoginCredentialsToEmailAddress_${index}`}>{i18n['Send login credentials to email address']}</label>
              <input
                type="email"
                className="form-control"
                id={`sendLoginCredentialsToEmailAddress_${index}`}
                defaultValue={data.v_ftp_email}
                name={`v_ftp_user[${index}][v_ftp_email]`} />
            </div>
          )
        }

      </div>
    </div>
  );
}

export default AdditionalFtpForEditing;