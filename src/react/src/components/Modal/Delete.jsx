import React from 'react';
import { useSelector } from 'react-redux';

const Delete = (props) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <div className="modal-content delete">
      <div className="modal-header">
        {props.items > 0 ?
          <h3>{i18n['Delete items']} <span className="quot">({props.items})</span> ?</h3> :
          <h3>{i18n['Are you sure you want to delete']} <span className="quot">&quot;{props.fName}&quot;</span>?</h3>}
      </div>
      <div className="modal-footer lower">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{i18n['Cancel']}</button>
        <button type="button" className="btn btn-primary" onClick={props.save} autoFocus>{i18n['Delete']}</button>
      </div>
    </div>
  );
}

export default Delete;