import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import TextArea from 'src/components/ControlPanel/AddItemLayout/Form/TextArea/TextArea';

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

      <input type="hidden" value="same" name="v_ssl_home" />

      <TextArea
        id="ssl-certificate"
        name="v_ssl_crt"
        title={i18n['SSL Certificate']}
        value={props.sslCertificate}
        disabled={letsEncrypt}
        optionalTitle={<>/ <button type="button" onClick={() => props.setModalVisible(true)} className="generate-csr">{i18n['Generate CSR']}</button></>} />

      <div class="form-group">
        <label htmlFor="aliases">{i18n['SSL Key']}</label>
        <textarea class="form-control" id="ssl_key" rows="3" name="v_ssl_key" defaultValue={props.sslKey} disabled={letsEncrypt}></textarea>
      </div>

      <div class="form-group">
        <label htmlFor="aliases">{i18n['SSL Certificate Authority / Intermediate']}</label>
        <textarea class="form-control" id="ssl_ca" rows="3" name="v_ssl_ca" disabled={letsEncrypt}></textarea>
      </div>
    </div>
  );
}

export default SslSupport;
