import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import './SslSupport.scss';

const SslSupport = props => {
  const { i18n } = useSelector(state => state.session);
  const [letsEncrypt, setLetsEncrypt] = useState(false);

  return (
    <div className="ssl-support">
      <div className="form-group">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            name="v_letsencrypt"
            id="lets-encrypt"
            checked={letsEncrypt}
            onChange={() => setLetsEncrypt(!letsEncrypt)} />
          <label htmlFor="lets-encrypt">{i18n['Lets Encrypt Support']}</label>
        </div>
        <span className="lets-encrypt-span">{letsEncrypt ? i18n['Your certificate will be automatically issued in 5 minutes'] : null}</span>
      </div>

      <div class="form-group">
        <label htmlFor="package">{i18n['SSL Home Directory']}</label>
        <select class="form-control" id="ssl_home" name="v_ssl_home">
          <option value="same">public_html</option>
          <option value="single">public_shtml</option>
        </select>
      </div>

      <div class="form-group">
        <label htmlFor="aliases">{i18n['SSL Certificate']}</label>
        <textarea class="form-control" id="aliases" rows="3" name="v_ssl_crt" disabled={letsEncrypt}></textarea>
      </div>

      <div class="form-group">
        <label htmlFor="aliases">{i18n['SSL Key']}</label>
        <textarea class="form-control" id="aliases" rows="3" name="v_ssl_key" disabled={letsEncrypt}></textarea>
      </div>

      <div class="form-group">
        <label htmlFor="aliases">{i18n['SSL Certificate Authority / Intermediate']}</label>
        <textarea class="form-control" id="aliases" rows="3" name="v_ssl_ca" disabled={letsEncrypt}></textarea>
      </div>
    </div>
  );
}

export default SslSupport;