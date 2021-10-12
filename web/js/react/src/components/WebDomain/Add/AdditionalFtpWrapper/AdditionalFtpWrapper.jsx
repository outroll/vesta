import React, { useEffect, useState } from 'react';

import AdditionalFtp from '../AdditionalFtp/AdditionalFtp';
import AdditionalFtpForEditing from '../AdditionalFtpForEditing/AdditionalFtpForEditing';

const AdditionalFtpWrapper = props => {
  const { i18n } = window.GLOBAL.App;
  const [state, setState] = useState({
    additionalFtp: [1],
    editIndexing: false
  });

  useEffect(() => {
    if (props.ftps) {
      // For EditWeb.jsx. Second state is kept for indexing Additional Ftp ( starting from 0 )
      setState({ ...state, additionalFtp: props.ftps, editIndexing: true });
    }
  }, [props.ftps]);

  const renderAdditionalFtps = () => {
    if (state.additionalFtp.length) {
      return state.additionalFtp.map((ftp, index) => {
        if (state.editIndexing) {
          return <AdditionalFtpForEditing
            key={index}
            prefixI18N={props.prefixI18N}
            index={index}
            data={ftp}
            domain={props.domain}
            onDeleteAdditionalFtp={index => onDeleteFtp(index)} />;
        } else {
          return <AdditionalFtp
            key={index}
            prefixI18N={props.prefixI18N}
            index={index + 1}
            domain={props.domain}
            onDeleteAdditionalFtp={index => onDeleteFtp(index)} />;
        }
      });
    } else {
      props.unCheckAdditionalFtpBox();
    }
  }

  const onDeleteFtp = index => {
    let additionalFtpsDuplicate = [...state.additionalFtp];

    additionalFtpsDuplicate.splice(index - 1, 1);

    setState({ ...state, additionalFtp: additionalFtpsDuplicate });
  }

  const addAdditionalFtp = () => {
    let additionalFtpArrayLength = state.additionalFtp.length;
    let additionalFtpsDuplicate = [...state.additionalFtp];

    additionalFtpsDuplicate.push(additionalFtpArrayLength + 1);

    setState({ ...state, additionalFtp: additionalFtpsDuplicate });
  }

  return (
    <div>
      {renderAdditionalFtps()}

      <button type="button" onClick={() => addAdditionalFtp()}>
        {i18n['Add one more FTP Account'] ?? 'Add'}
      </button>
    </div>
  );
}

export default AdditionalFtpWrapper;