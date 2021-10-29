import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Password from '../../../../components/ControlPanel/AddItemLayout/Form/Password/Password';

import './AdditionalFtp.scss';

const AdditionalFtp = ({ domain, data = {}, onDeleteAdditionalFtp, prefixI18N }) => {
  const { i18n, userName } = useSelector(state => state.session);
  const [state, setState] = useState({
    path: '',
    username: ''
  });

  return (
    <div className="additional-ftp">
      <div className="title">
        <span>{i18n.FTP} #{data.id}</span>
        <span>
          &nbsp;
          <button type="button" onClick={() => onDeleteAdditionalFtp(data.id)}>({i18n.Delete ?? 'Delete'})</button>
        </span>
      </div>

      <div className="form-transform">
        <div className="form-group username">
          <label htmlFor={`username_${data.id}`}>{i18n.Username}</label>
          <span className="prefix-note">{prefixI18N}</span>
          <div className="input-wrapper">
            <input
              value={state.username}
              onChange={event => setState({ ...state, username: event.target.value })}
              type="text"
              className="form-control"
              id={`username_${data.id}`}
              name={`v_ftp_user[${data.id}][v_ftp_user]`} />
            <span>{`${userName}_${state.username}`}</span>
          </div>
        </div>

        <Password name={`v_ftp_user[${data.id}][v_ftp_password]`} id={data.id} />

        <div className="form-group">
          <label htmlFor={`path${data.id}`}>{i18n.Path}</label>
          <input
            type="text"
            value={state.path}
            onChange={event => setState({ ...state, path: event.target.value })}
            className="form-control"
            id={`path${data.id}`}
            name={`v_ftp_user[${data.id}][v_ftp_path]`} />
          <span className="path-note">{`/web/${domain ? domain + '/' : ''}${state.path}`}</span>
        </div>

        <div className="form-group">
          <label htmlFor={`sendLoginCredentialsToEmailAddress_${data.id}`}>{i18n['Send login credentials to email address']}</label>
          <input
            type="email"
            className="form-control"
            id={`sendLoginCredentialsToEmailAddress_${data.id}`}
            name={`v_ftp_user[${data.id}][v_ftp_email]:`} />
          <input type="hidden" name={`v_ftp_user[${data.id}][delete]`} value="0" />
          <input type="hidden" name={`v_ftp_user[${data.id}][is_new]`} value="1" />
          <input type="hidden" name={`v_ftp_pre_path`} value={domain ? `/web/${domain}/` : ''} />
        </div>
      </div>
    </div>
  );
}

export default AdditionalFtp;