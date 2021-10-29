import React from 'react';
import { useSelector } from 'react-redux';

const Rename = (props) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <div className="modal-content rename">
      <div className="modal-header">
        <h3 className="modal-title rename">{i18n['Rename']} <span className="quot">&quot;{props.fName}&quot;</span></h3>
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={props.fName} onChange={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{i18n['Cancel']}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{i18n['Rename']}</button>
      </div>
    </div>
  );
}

export default Rename;