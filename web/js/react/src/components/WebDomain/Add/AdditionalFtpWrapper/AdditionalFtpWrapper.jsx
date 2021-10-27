import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdditionalFtpForEditing from '../AdditionalFtpForEditing/AdditionalFtpForEditing';
import './AdditionalFtpWrapper.scss';

const AdditionalFtpWrapper = ({ checked, ftps, unCheckAdditionalFtpBox, prefixI18N, ftpUserPrePath, domain, ...props }) => {
  const { i18n } = useSelector(state => state.session);
  const [state, setState] = useState({
    additionalFtp: []
  });

  useEffect(() => {
    if (ftps) {
      const data = ftps.map((item, index) => {
        item['deleted'] = !checked;
        item['id'] = index;
        return item;
      });

      setState({ ...state, additionalFtp: data });
    }
  }, [checked, ftps]);

  const renderAdditionalFtps = () => {
    return state.additionalFtp.map(ftp => {
      return <AdditionalFtpForEditing
        key={ftp.id}
        prefixI18N={prefixI18N}
        data={ftp}
        checked={checked}
        prePath={ftpUserPrePath}
        domain={domain}
        onDeleteAdditionalFtp={id => onDeleteFtp(id)} />;
    });
  }

  const onDeleteFtp = index => {
    let updatedAdditionalFtps = [];

    state.additionalFtp.forEach(item => {
      if (item.id === index) {
        item.deleted = true;
      }

      updatedAdditionalFtps.push(item);
    });

    if (!updatedAdditionalFtps.length) {
      unCheckAdditionalFtpBox();
    }

    setState({ ...state, additionalFtp: updatedAdditionalFtps });
  }

  const addAdditionalFtp = () => {
    let additionalFtpArrayLength = state.additionalFtp.length;
    let additionalFtpsDuplicate = [...state.additionalFtp];

    additionalFtpsDuplicate.push({ id: additionalFtpArrayLength, deleted: false, is_new: 1 });

    setState({ ...state, additionalFtp: additionalFtpsDuplicate });
  }

  return (
    <div>
      {renderAdditionalFtps()}

      {checked && (
        <button type="button" onClick={() => addAdditionalFtp()}>
          {i18n['Add one more FTP Account'] ?? 'Add'}
        </button>)}
    </div>
  );
}

export default AdditionalFtpWrapper;
