import React from 'react';

const Extract = (props) => {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title rename">{window.GLOBAL.App.Constants.FM_EXTRACT} <span className="quot">&quot;{props.fName}&quot;</span>{window.GLOBAL.App.Constants.FM_INTO_KEYWORD}</h3>
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={props.path} onBlur={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{window.GLOBAL.App.Constants.FM_CANCEL}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{window.GLOBAL.App.Constants.FM_EXTRACT}</button>
      </div>
    </div>
  );
}

export default Extract;