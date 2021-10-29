import React from 'react';
import { useSelector } from 'react-redux';

const Move = (props) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <div className="modal-content">
      <div className="modal-header">
        {props.items > 0 ?
          <h3 className="modal-title">{i18n['Move files']} <span className="quot">({props.items})</span> {i18n['into']}:</h3> :
          <h3 className="modal-title rename">{i18n['Move']} <span className="quot">&quot;{props.fName}&quot;</span> {i18n['into']}:</h3>}
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={props.path} onChange={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{i18n['Cancel']}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{i18n['Move']}</button>
      </div>
    </div>
  );
}

export default Move;