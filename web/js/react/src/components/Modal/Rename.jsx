import React from 'react';

const Rename = (props) => {
  const { Constants } = window.GLOBAL.App;

  return (
    <div className="modal-content rename">
      <div className="modal-header">
        <h3 className="modal-title rename">{Constants.FM_RENAME} <span className="quot">&quot;{props.fName}&quot;</span></h3>
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={props.fName} onChange={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{Constants.FM_CANCEL}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{Constants.FM_RENAME}</button>
      </div>
    </div>
  );
}

export default Rename;