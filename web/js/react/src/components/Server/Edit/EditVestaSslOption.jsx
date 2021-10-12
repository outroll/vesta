import React, { useEffect, useState } from 'react';

import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextArea from 'src/components/ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import Checkbox from 'src/components/ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import { Link } from 'react-router-dom';

const EditVestaSslOption = ({ data, visible }) => {
  const { i18n } = window.GLOBAL.App;
  const [domainsVisible, setDomainsVisible] = useState(false);
  const [sslDomains, setSslDomains] = useState([]);

  useEffect(() => {
    const { ssl_domains } = data;

    if (ssl_domains) {
      setSslDomains(['', ...ssl_domains]);
    } else {
      setSslDomains(['']);
    }

  }, []);

  return (
    <div className="server-ssl-option" style={{ display: `${visible ? 'block' : 'none'}` }}>
      <Checkbox
        onChange={checked => setDomainsVisible(checked)}
        title={i18n['Use Web Domain SSL Certificate']}
        defaultChecked={data.vesta_certificate}
        name="v_web_ssl_domain_checkbox"
        id="web_ssl_domain_checkbox"
        checked={domainsVisible}
      />

      {
        domainsVisible && (
          <div className="domain-group">
            <SelectInput
              selected={data.vesta_certificate}
              name="v_web_ssl_domain"
              title={i18n['Domain']}
              options={sslDomains}
              id="web_ssl_domain" />
          </div>
        )
      }

      <TextArea
        title={i18n['SSL Certificate']}
        defaultValue={data.sys_ssl_crt}
        name="v_sys_ssl_crt"
        id="sys_ssl_crt" />

      <TextArea
        defaultValue={data.sys_ssl_key}
        id="sys_ssl_key"
        name="v_sys_ssl_key"
        title={i18n['SSL Key']} />

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
  );
}

export default EditVestaSslOption;