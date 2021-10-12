import React from 'react';

const Extract = (props) => {
  const { Constants } = window.GLOBAL.App;

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title rename">{Constants.FM_EXTRACT} <span className="quot">&quot;{props.fName}&quot;</span>{Constants.FM_INTO_KEYWORD}</h3>
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={props.path} onBlur={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{Constants.FM_CANCEL}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{Constants.FM_EXTRACT}</button>
      </div>
    </div>
  );
}

export default Extract;