import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Checkbox from '../../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import TextArea from '../../../ControlPanel/AddItemLayout/Form/TextArea/TextArea';

import './SslSupport.scss';

const SslSupport = props => {
  const { i18n } = useSelector(state => state.session);
  const [letsEncrypt, setLetsEncrypt] = useState(props.letsEncrypt);

  useEffect(() => {
    setLetsEncrypt(props.letsEncrypt);
  }, []);

  const onChangeLetsEncrypt = checked => {
    setLetsEncrypt(checked);
  }

  return (
    <div className="ssl-support">
      <>
        <Checkbox
          onChange={onChangeLetsEncrypt}
          name="v_letsencrypt"
          id="lets-encrypt"
          title={i18n['Lets Encrypt Support']}
          defaultChecked={letsEncrypt} />

        {!props.letsEncrypt && <span className="lets-encrypt-span">{letsEncrypt ? i18n['Your certificate will be automatically issued in 5 minutes'] : null}</span>}
      </>

      <input type="hidden" value="same" name="v_ssl_home" />

      <TextArea
        id="ssl-certificate"
        name="v_ssl_crt"
        title={i18n['SSL Certificate']}
        defaultValue={props.sslCertificate}
        disabled={letsEncrypt}
        optionalTitle={<>/ <button type="button" onClick={() => props.setModalVisible(true)} className="generate-csr">{i18n['Generate CSR']}</button></>} />

      <TextArea
        id="ssl-key"
        name="v_ssl_key"
        disabled={letsEncrypt}
        defaultValue={props.sslKey}
        title={i18n['SSL Key']} />

      <TextArea
        id="ssl-ca"
        name="v_ssl_ca"
        disabled={letsEncrypt}
        defaultValue={props.sslCertificateAuthority}
        title={i18n['SSL Certificate Authority / Intermediate']}
        optionalTitle={`( ${i18n['optional']} )`} />

      <div className="additional-info">
        {
          props.sslSubject.length > 0
          && (
            <div>
              <span>{i18n['SUBJECT']}:</span>
              <span>{props.sslSubject}</span>
            </div>
          )
        }

        {
          props.sslAliases.length > 0
          && (
            <div>
              <span>{i18n['ALIASES']}:</span>
              <span>{props.sslAliases}</span>
            </div>
          )
        }

        {
          props.sslNotBefore.length > 0
          && (
            <div>
              <span>{i18n['NOT_BEFORE']}:</span>
              <span>{props.sslNotBefore}</span>
            </div>
          )
        }

        {
          props.sslNotAfter.length > 0
          && (
            <div>
              <span>{i18n['NOT_AFTER']}:</span>
              <span>{props.sslNotAfter}</span>
            </div>
          )
        }

        {
          props.sslSignature.length > 0
          && (
            <div>
              <span>{i18n['SIGNATURE']}:</span>
              <span>{props.sslSignature}</span>
            </div>
          )
        }

        {
          props.sslPubKey.length > 0
          && (
            <div>
              <span>{i18n['PUB_KEY']}:</span>
              <span>{props.sslPubKey}</span>
            </div>
          )
        }

        {
          props.sslIssuer.length > 0
          && (
            <div>
              <span>{i18n['ISSUER']}:</span>
              <span>{props.sslIssuer}</span>
            </div>
          )
        }
      </div>

      <br />
      <br />
    </div>
  );
}

export default SslSupport;
