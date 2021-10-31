import React, { useState } from 'react';

import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import { useSelector } from 'react-redux';

const EditVestaPluginsOption = ({ data, visible }) => {
  const { i18n } = useSelector(state => state.session);
  const { session } = useSelector(state => state.userSession);
  const [sftpValue, setSftpValue] = useState(data.lead || session['SFTPJAIL_KEY'] ? 'yes' : 'no');
  const [fmValue, setFmValue] = useState(data.fm_lead || session['FILEMANAGER_KEY'] ? 'yes' : 'no');
  const [softaculousValue, setSoftaculousValue] = useState(session['SOFTACULOUS'] === 'yes' ? 'yes' : 'no');

  const renderSoftaculous = () => {
    if (softaculousValue === 'yes') {
      if (session['SOFTACULOUS'] === 'yes') {
        return (<div className="soft-module">
          <div>
            <span style={{ fontWeight: 'bolder' }}>{i18n['* plugin installation will run in background']}</span>
            <span>
              Softaculous is a great Auto Installer having 426 great scripts, 1115 PHP Classes
              and we are still adding more. Softaculous is ideal for Web Hosting companies and
              it could give a significant boost to your sales. These scripts cover most of the
              uses a customer could ever have. We have covered a wide array of Categories so that
              everyone could find the required script one would need to power their Web Site.
            </span>
          </div>

          <div className="buy-license">
            <a href="https://www.softaculous.com/softaculous/" target="_blank" rel="noopener noreferrer">
              {i18n['Get Premium License'] ?? 'Get Premium License'}
            </a>
          </div>
        </div>);
      }
    }
  }

  const renderSftp = () => {
    if (sftpValue === 'yes') {
      if (!data.sftp_license_key && session['SFTPJAIL_KEY']) {
        return (<div className="sftp-module">
          <div>{i18n['Restrict users so that they cannot use SSH and access only their home directory.']}</div>
          <div className="license-description">
            <span>{i18n['Licence Key']}:</span>
            <TextInput
              title={i18n['License Key']}
              value={data.licence_key}
              name="v_sftp_licence"
              id="sftp_licence" />
          </div>
        </div>)
      } else {
        return (<div className="sftp-module">
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
        </div>)
      }
    }
  }

  const renderFm = () => {
    if (fmValue === 'yes') {
      if (!data.fm_license_key && session['FILEMANAGER_KEY']) {
        return (<div className="fm-module">
          <div>{i18n['Browse, copy, edit, view, and retrieve all of your web domain files using fully featured File Manager.']}</div>
          <div className="license-description">
            <span>{i18n['Licence Key']}:</span>
            <TextInput
              title={i18n['Licence Key']}
              value={data.fm_licence_key_option}
              name="v_filemanager_licence"
              id="filemanager_licence" />
          </div>
        </div>);
      } else {
        return (<div className="fm-module">
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
            <a href={`https://vestacp.com/checkout/2co.php?product_id=7&referer=${data.http_host}`} target="_blank" rel="noopener noreferrer">
              {i18n['Buy Licence']} 3$ {i18n['month']}
            </a>
            <a href={`https://vestacp.com/checkout/2co.php?product_id=8&referer=${data.http_host}`} target="_blank" rel="noopener noreferrer">
              {i18n['Buy Lifetime License']} 28$
            </a>
          </div>

          <span>2Checkout.com Inc. (Ohio, USA) is a payment facilitator for goods and services provided by vestacp.com.</span>
        </div>)
      }
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

      <div className="form-group select-group">
        <label className="label-wrapper" htmlFor="quota">
          {i18n['FileSystem Disk Quota']}
        </label>
        <select className="form-control" id="quota" name="v_quota">
          <option value="no">{i18n['no']}</option>
          <option value="yes" selected={data.disk_quota === 'yes'}>{i18n['yes']}</option>
        </select>
      </div>

      <br />

      <div className="form-group select-group">
        <label className="label-wrapper" htmlFor="firewall">
          {i18n['Firewall']}
        </label>
        <select className="form-control" id="firewall" name="v_firewall">
          <option value="no">{i18n['no']}</option>
          <option value="yes" selected={data.firewall_system === 'iptables'}>{i18n['yes']}</option>
        </select>
      </div>

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

      <div className="form-group select-group">
        <label className="label-wrapper" htmlFor="sftp">
          {i18n['SFTP Chroot']}
        </label>
        <select className="form-control" id="sftp" name="v_sftp" onChange={event => setSftpValue(event.target.value)}>
          {
            session['SFTPJAIL_KEY']
              ? <option value="cancel">{i18n['Disable and Cancel Licence']}</option>
              : <option value="no">{i18n['no']}</option>
          }

          <option value="yes" selected={data.lead || session['SFTPJAIL_KEY']}>{i18n['yes']}</option>
        </select>
      </div>

      {renderSftp()}

      <br />

      <div className="form-group select-group">
        <label className="label-wrapper" htmlFor="filemanager">
          {i18n['File Manager']}
        </label>
        <select className="form-control" id="filemanager" name="v_filemanager" onChange={event => setFmValue(event.target.value)}>
          {
            session['FILEMANAGER_KEY']
              ? <option value="cancel">{i18n['Disable and Cancel Licence']}</option>
              : <option value="no">{i18n['no']}</option>
          }

          <option value="yes" selected={data.fm_lead || session['FILEMANAGER_KEY']}>{i18n['yes']}</option>
        </select>
      </div>

      {renderFm()}

      <br />

      <div className="form-group select-group">
        <label className="label-wrapper" htmlFor="softaculous">
          {i18n['Softaculous'] ?? 'Softaculous'}
        </label>
        <select className="form-control" id="softaculous" name="v_softaculous" onChange={event => setSoftaculousValue(event.target.value)}>
          <option value="no">{i18n['no']}</option>
          <option value="yes" selected={data.softaculous_lead || session['SOFTACULOUS'] === 'yes'}>{i18n['yes']}</option>
        </select>
      </div>

      {renderSoftaculous()}
    </div>
  );
}

export default EditVestaPluginsOption;
