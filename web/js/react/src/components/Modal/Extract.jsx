import React from 'react';
import { useSelector } from 'react-redux';

const Extract = (props) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title rename">{i18n['Extract']} <span className="quot">&quot;{props.fName}&quot;</span>{i18n['into']}</h3>
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={props.path} onBlur={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{i18n['Cancel']}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{i18n['Extract']}</button>
      </div>
    </div>
  );
}

export default Extract;