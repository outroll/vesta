import React from 'react';
import { useSelector } from 'react-redux';

const NothingSelected = (props) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <div className="modal-content nothing-selected">
      <div className="header">
        {props.notAvailable ? <h3>{i18n['Directory download not available in current version']}</h3> : <h3>{i18n['No file selected']}</h3>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{i18n['Close']}</button>
      </div>
    </div>
  );
}

export default NothingSelected;