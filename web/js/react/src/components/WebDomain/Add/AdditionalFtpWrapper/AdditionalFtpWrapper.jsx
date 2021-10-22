import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdditionalFtp from '../AdditionalFtp/AdditionalFtp';
import AdditionalFtpForEditing from '../AdditionalFtpForEditing/AdditionalFtpForEditing';

const AdditionalFtpWrapper = props => {
  const { i18n } = useSelector(state => state.session);
  const [state, setState] = useState({
    additionalFtp: []
  });

  useEffect(() => {
    if (props.ftps) {
      const data = props.ftps.map((item, index) => {
        item['deleted'] = false;
        item['id'] = index;
        return item;
      });
      setState({ ...state, additionalFtp: data });
    }
  }, [props.ftps]);

  const renderAdditionalFtps = () => {
    return state.additionalFtp.map(ftp => {
      return <AdditionalFtpForEditing
        key={ftp.id}
        prefixI18N={props.prefixI18N}
        data={ftp}
        checked={props.checked}
        prePath={props.ftpUserPrePath}
        domain={props.domain}
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
      props.unCheckAdditionalFtpBox();
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

      {props.checked && (
        <button type="button" onClick={() => addAdditionalFtp()}>
          {i18n['Add one more FTP Account'] ?? 'Add'}
        </button>)}
    </div>
  );
}

export default AdditionalFtpWrapper;
