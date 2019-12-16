import React from 'react';

const Copy = (props) => {
  return (
    <div className="modal-content">
      <div className="modal-header">
        {props.items > 0 ?
          <h3 className="modal-title">{window.GLOBAL.App.Constants.FM_COPY_BULK} <span className="quot">({props.items})</span> {window.GLOBAL.App.Constants.FM_INTO_KEYWORD}:</h3> :
          <h3 className="modal-title rename">{window.GLOBAL.App.Constants.FM_COPY} <span className="quot">&quot;{props.fName}&quot;</span> {window.GLOBAL.App.Constants.FM_INTO_KEYWORD}:</h3>}
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={props.path} onChange={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{window.GLOBAL.App.Constants.FM_CANCEL}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{window.GLOBAL.App.Constants.FM_COPY}</button>
      </div>
    </div>
  );
}

export default Copy;