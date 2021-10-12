import React, { useEffect, useState } from 'react';
import BackupRestoreSettings from '../../components/Backup/RestoreSettings/BackupRestoreSettings';
import { useHistory } from 'react-router-dom';
import Backups from '../Backups/Backups';
import QueryString from 'qs';
import { Helmet } from 'react-helmet';

export default function BackupWrapper(props) {
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });
  const [isBackupSettings, setIsBackupSettings] = useState(false);

  useEffect(() => {
    if (parsedQueryString.backup) {
      setIsBackupSettings(true);
    } else {
      setIsBackupSettings(false);
    }
  }, [history.location]);

  return (
    <>
      <Helmet>
        <title>{`Vesta - ${i18n.DNS}`}</title>
      </Helmet>
      {
        isBackupSettings
          ? <BackupRestoreSettings backup={parsedQueryString.backup} />
          : <Backups {...props} changeSearchTerm={props.changeSearchTerm} />
      }
    </>
  );
}