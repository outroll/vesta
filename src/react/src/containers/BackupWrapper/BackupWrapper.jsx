import React, { useEffect, useState } from 'react';
import BackupRestoreSettings from '../../components/Backup/RestoreSettings/BackupRestoreSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import Backups from '../Backups/Backups';
import QueryString from 'qs';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

export default function BackupWrapper(props) {
  const { i18n } = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQueryString = QueryString.parse(location.search, { ignoreQueryPrefix: true });
  const [isBackupSettings, setIsBackupSettings] = useState(false);

  useEffect(() => {
    if (parsedQueryString.backup) {
      setIsBackupSettings(true);
    } else {
      setIsBackupSettings(false);
    }
  }, [location]);

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