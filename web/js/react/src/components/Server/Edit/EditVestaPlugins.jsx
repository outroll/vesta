import React, { useEffect, useState } from 'react';

import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import { Link } from 'react-router-dom';

const EditVestaPluginsOption = ({ data, visible }) => {
  const { i18n } = window.GLOBAL.App;
  const [sftpOptions, setSftpOptions] = useState([]);
  const [fmOptions, setFmOptions] = useState([]);
  const [sftpDescription, setSftpDescription] = useState(false);
  const [fmDescription, setFmDescription] = useState(false);
  const [softaculousDescription, setSoftaculousDescription] = useState(false);

  useEffect(() => {
    let sftpOptionsArray = [];
    let fmOptionsArray = [];

    if (data.sftpjail_key) {
      sftpOptionsArray.push(i18n['Disable and Cancel Licence']);
    }

    sftpOptionsArray.push(i18n['yes']);

    if (data.fm_key) {
      fmOptionsArray.push(i18n['Disable and Cancel Licence']);
    }

    fmOptionsArray.push(i18n['yes']);

    setSftpOptions(sftpOptionsArray);
    setFmOptions(fmOptionsArray);

    if (data.lead === 'sftp' || data.sftpjail_key != '') {
      setSftpDescription(true);
    }

    if (data.lead === 'filemanager' || data.fm_key != '') {
      setFmDescription(true);
    }

    if (data.lead === 'softaculous' || data.softaculous != '') {
      setSoftaculousDescription(true);
    }
  }, []);

  const onChangeSftpChroot = value => {
    if (value !== i18n['yes']) {
      setSftpDescription(false);
    } else {
      setSftpDescription(true);
    }
  }

  const onChangeFm = value => {
    if (value !== i18n['yes']) {
      setFmDescription(false);
    } else {
      setFmDescription(true);
    }
  }

  const onChangeSoftaculous = value => {
    if (value !== i18n['yes']) {
      setSoftaculousDescription(true);
    } else {
      setSoftaculousDescription(false);
    }
  }

  return (
    <div className="server-plugins-option" style={{ display: `${visible ? 'block' : 'none'}` }}>
      <TextInput
        title={i18n['Version']}
        value={data.version}
        name="v_version"
        id="version"
        disabled />

      <SelectInput
        title={i18n['FileSystem Disk Quota']}
        selected={data.disk_quota}
        options={data.yes_no_options}
        name="v_quota"
        id="quota" />

      <br />

      <SelectInput
        title={i18n['Firewall']}
        selected={data.firewall_system === 'iptables' ? i18n['yes'] : ''}
        options={data.yes_no_options}
        name="v_firewall"
        id="firewall" />

      <SelectInput
        title={i18n['Reseller Role']}
        options={[i18n['yes']]}
        name="v_reseller"
        id="reseller"
        disabled />

      <SelectInput
        title={i18n['Backup Migration Manager']}
        options={[i18n['yes']]}
        name="v_backup_manager"
        id="backup_manager"
        disabled />

      <SelectInput
        title={i18n['SFTP Chroot']}
        selected={data.lead === 'sftp' || data.sftpjail_key != '' ? i18n['yes'] : ''}
        name="v_backup_manager"
        options={sftpOptions}
        onChange={onChangeSftpChroot}
        id="backup_manager" />

      {
        sftpDescription
          ? (
            <div className="sftp-module">
              <div>{i18n['Restrict users so that they cannot use SSH and access only their home directory.']}</div>
              <div className="license-description">
                <span>{i18n['Licence Key']}:</span>
                <TextInput
                  title={i18n['Version']}
                  value={data.version}
                  name="v_version"
                  id="version" />
              </div>
            </div>
          )
          : (
            <div className="sftp-module">
              <>
                <span>{i18n['Restrict users so that they cannot use SSH and access only their home directory.']}</span>
                <span>{i18n['This is a commercial module, you would need to purchace license key to enable it.']}</span>
              </>
              <div className="license-description">
                <span>{i18n['Enter License Key']}:</span>
                <TextInput
                  title={i18n['Version']}
                  name="v_sftp_licence"
                  id="sftp_licence" />
              </div>

              <div className="buy-license">
                <a href={`https://vestacp.com/checkout/2co.php?product_id=6&referer=${data.http_host}`}>
                  {i18n['Buy Licence']} 3$ {i18n['month']}
                </a>
                <a href={`https://vestacp.com/checkout/2co.php?product_id=9&referer=${data.http_host}`}>
                  {i18n['Buy Lifetime License']} 18$
                </a>
              </div>

              <span>2Checkout.com Inc. (Ohio, USA) is a payment facilitator for goods and services provided by vestacp.com.</span>
            </div>
          )
      }

      <br />

      <SelectInput
        title={i18n['File Manager']}
        selected={data.lead === 'filemanager' || data.fm_key ? i18n['yes'] : ''}
        options={fmOptions}
        onChange={onChangeFm}
        name="v_filemanager"
        id="filemanager" />

      {
        fmDescription
          ? (
            <div className="fm-module">
              <div>{i18n['Browse, copy, edit, view, and retrieve all of your web domain files using fully featured File Manager.']}</div>
              <div className="license-description">
                <span>{i18n['Licence Key']}:</span>
                <TextInput
                  title={i18n['Version']}
                  value={data.fm_licence_key_option}
                  name="v_filemanager_licence"
                  id="filemanager_licence" />
              </div>
            </div>
          )
          : (
            <div className="fm-module">
              <>
                <span>{i18n['Browse, copy, edit, view, and retrieve all of your web domain files using fully featured File Manager.']}</span>
                <span>{i18n['This is a commercial module, you would need to purchace license key to enable it.']}</span>
              </>
              <div className="license-description">
                <span>{i18n['Enter License Key']}:</span>
                <TextInput
                  title={i18n['Version']}
                  value=""
                  name="v_filemanager_licence"
                  id="sftp_licence" />
              </div>

              <div className="buy-license">
                <a href={`https://vestacp.com/checkout/2co.php?product_id=7&referer=${data.http_host}`} target="_blank">
                  {i18n['Buy Licence']} 3$ {i18n['month']}
                </a>
                <a href={`https://vestacp.com/checkout/2co.php?product_id=8&referer=${data.http_host}`} target="_blank">
                  {i18n['Buy Lifetime License']} 28$
                </a>
              </div>

              <span>2Checkout.com Inc. (Ohio, USA) is a payment facilitator for goods and services provided by vestacp.com.</span>
            </div>
          )
      }

      <br />

      <SelectInput
        title="Softaculous"
        selected={data.lead === 'softaculous' || data.softaculous === 'yes' ? i18n['yes'] : ''}
        options={[i18n['no'], i18n['yes']]}
        onChange={onChangeSoftaculous}
        name="v_softaculous"
        id="softaculous" />

      {
        softaculousDescription === 'yes' && (
          <div className="soft-module">
            <div>{i18n['Browse, copy, edit, view, and retrieve all of your web domain files using fully featured File Manager.']}</div>
            <div className="license-description">
              <span>
                Softaculous is a great Auto Installer having 426 great scripts, 1115 PHP Classes
                and we are still adding more. Softaculous is ideal for Web Hosting companies and
                it could give a significant boost to your sales. These scripts cover most of the
                uses a customer could ever have. We have covered a wide array of Categories so that
                everyone could find the required script one would need to power their Web Site.
              </span>
              <a href="https://www.softaculous.com/softaculous/" target="_blank">
                {i18n['Get Premium License']}
              </a>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default EditVestaPluginsOption;