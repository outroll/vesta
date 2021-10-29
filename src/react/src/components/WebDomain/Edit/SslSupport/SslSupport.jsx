import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Checkbox from '../../../ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import SelectInput from '../../../ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextArea from '../../../ControlPanel/AddItemLayout/Form/TextArea/TextArea';

import './SslSupport.scss';

const SslSupport = props => {
  const { i18n } = useSelector(state => state.session);
  const [letsEncrypt, setLetsEncrypt] = useState(false);
  const [sslHomeOptions, setSslHomeOptions] = useState(['public_html', 'public_shtml']);

  useEffect(() => {
    setLetsEncrypt(props.letsEncrypt);
  }, []);

  const onChangeLetsEncrypt = checked => {
    setLetsEncrypt(checked);
  }

  return (
    <div className="ssl-support">
      <Checkbox
        onChange={onChangeLetsEncrypt}
        name="v_letsencrypt"
        id="lets-encrypt"
        title={i18n['Lets Encrypt Support']}
        defaultChecked={letsEncrypt} />

      <SelectInput
        options={sslHomeOptions}
        selected={props.sslHome === 'same' ? 'public_html' : 'public_shtml'}
        name="v_ssl_home"
        id="ssl_home"
        title={i18n['SSL Home Directory']} />

      <TextArea
        id="ssl-certificate"
        name="v_ssl_crt"
        title={i18n['SSL Certificate']}
        defaultValue={props.sslCertificate}
        disabled={letsEncrypt}
        optionalTitle={
          !letsEncrypt
            ? (<>/ <Link className="generate-csr" target="_blank" to={`/generate/ssl/?domain=${props.domain}`}>{i18n['Generate CSR']}</Link></>)
            : ''
        } />

      <TextArea
        id="ssl-key"
        name="v_ssl_key"
        disabled={letsEncrypt}
        defaultValue={props.sslKey}
        title={i18n['SSL Key']} />

      <TextArea
        id="ssl-key"
        name="v_ssl_key"
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