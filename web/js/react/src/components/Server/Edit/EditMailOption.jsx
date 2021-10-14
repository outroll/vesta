import React, { useEffect, useState } from 'react';

import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from 'src/components/ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import { Link } from 'react-router-dom';

const EditMailOption = ({ data, visible }) => {
  const { i18n } = window.GLOBAL.App;
  const [mailCertificateSystem, setMailCertificateSystem] = useState(false);

  useEffect(() => {
    if (data.mail_certificate) {
      setMailCertificateSystem(true);
    }
  }, []);

  const getMailCertificateOptions = () => {
    let result = ['', ...data.ssl_domains];
    return result;
  }

  return (
    <div className="server-mail-option" style={{ display: `${visible ? 'block' : 'none'}` }}>
      <TextInput
        optionalTitle={<Link to={`/edit/server/${data.mail_system}`}>{i18n['configure']}</Link>}
        title={i18n['MAIL Server'] + ' / '}
        name="v_mail_system"
        value={data.mail_system}
        id="mail_system"
        disabled />

      {
        data.antivirus_system && (
          <TextInput
            optionalTitle={<Link to={`/edit/server/${data.antivirus_system}`}>{i18n['configure']}</Link>}
            title={i18n['Antivirus'] + ' / '}
            name="v_antivirus_system"
            value={data.antivirus_system}
            id="antivirus_system"
            disabled />
        )
      }

      {
        data.antispam_system && (
          <TextInput
            optionalTitle={<Link to={`/edit/server/${data.antispam_system}`}>{i18n['configure']}</Link>}
            title={i18n['DNS Server'] + ' / '}
            name="v_antispam_system"
            value={data.antispam_system}
            id="antispam_system"
            disabled />
        )
      }

      <TextInput
        title={i18n['Webmail URL']}
        name="v_mail_url"
        value={data.mail_url}
        id="mail-url" />

      <br /><br />

      <Checkbox
        onChange={checked => setMailCertificateSystem(checked)}
        title={i18n['Use Web Domain SSL Certificate']}
        name="v_mail_ssl_domain_checkbox"
        id="mail-ssl-domain-checkbox"
        checked={!!data.mail_certificate} />

      {
        mailCertificateSystem && (
          <div className="mail-cert-info">
            <SelectInput
              options={getMailCertificateOptions()}
              selected={data.mail_certificate}
              name="v_mail_ssl_domain"
              title={i18n['Domain']}
              id="mail-ssl-domain" />

            <div className="additional-info">
              {
                data.sys_ssl_subject && (
                  <div>
                    <span>{i18n['SUBJECT']}:</span>
                    <span>{data.sys_ssl_subject}</span>
                  </div>
                )
              }

              {
                data.sys_ssl_aliases && (
                  <div>
                    <span>{i18n['ALIASES']}:</span>
                    <span>{data.sys_ssl_aliases}</span>
                  </div>
                )
              }

              {
                data.sys_ssl_not_before && (
                  <div>
                    <span>{i18n['NOT_BEFORE']}:</span>
                    <span>{data.sys_ssl_not_before}</span>
                  </div>
                )
              }

              {
                data.sys_ssl_not_after && (
                  <div>
                    <span>{i18n['NOT_AFTER']}:</span>
                    <span>{data.sys_ssl_not_after}</span>
                  </div>
                )
              }

              {
                data.sys_ssl_signature && (
                  <div>
                    <span>{i18n['SIGNATURE']}:</span>
                    <span>{data.sys_ssl_signature}</span>
                  </div>
                )
              }

              {
                data.sys_ssl_pub_key && (
                  <div>
                    <span>{i18n['PUB_KEY']}:</span>
                    <span>{data.sys_ssl_pub_key}</span>
                  </div>
                )
              }

              {
                data.sys_ssl_issuer && (
                  <div>
                    <span>{i18n['ISSUER']}:</span>
                    <span>{data.sys_ssl_issuer}</span>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  );
}

export default EditMailOption;