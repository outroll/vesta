import React, { useState } from 'react';

import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditBackupOption = ({ data, visible }) => {
  const { i18n } = window.GLOBAL.App;
  const [remoteBackup, setRemoteBackup] = useState(false);

  return (
    <div className="server-dns-option" style={{ display: `${visible ? 'block' : 'none'}` }}>
      <SelectInput
        options={[i18n['no'], i18n['yes']]}
        title={i18n['Local backup']}
        selected={data.backup}
        name="v_backup"
        id="backup" />

      <SelectInput
        options={['1', '2', '3', '4', '5', '6', '7', '8', '9']}
        title={i18n['Compression level']}
        selected={data.backup_gzip}
        name="v_backup_gzip"
        id="backup-gzip" />

      <TextInput
        title={i18n['Directory']}
        value={data.backup_dir}
        name="v_backup_dir"
        id="v-backup-dir" />

      {
        data.backup_remote_adv && (
          <>
            <button type="button" onClick={() => setRemoteBackup(!remoteBackup)}>
              {i18n['Remote backup']}
              {remoteBackup ? <FontAwesomeIcon icon="caret-up" /> : <FontAwesomeIcon icon="caret-down" />}
            </button>

            {
              remoteBackup && (
                <>
                  <SelectInput
                    selected={data.backup_type}
                    options={data.protocols}
                    title={i18n['Protocol']}
                    name="v_backup_type"
                    id="backup_type" />

                  <TextInput
                    title={i18n['Host']}
                    value={data.backup_host}
                    name="v_backup_host"
                    id="backup_host" />

                  <TextInput
                    title={i18n['Username']}
                    value={data.backup_username}
                    name="v_backup_username"
                    id="backup_username" />

                  <TextInput
                    title={i18n['Password']}
                    value={data.backup_password}
                    name="v_backup_password"
                    id="backup_password" />

                  <TextInput
                    title={i18n['Directory']}
                    value={data.backup_bpath}
                    name="v_backup_bpath"
                    id="backup_bpath" />
                </>
              )
            }
          </>
        )
      }
    </div>
  );
}

export default EditBackupOption;