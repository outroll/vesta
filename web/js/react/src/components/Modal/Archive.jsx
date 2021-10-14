import React from 'react';

const { i18n } = window.GLOBAL.App;

const Archive = (props) => {
  return (
    <div className="modal-content">
      <div className="modal-header">
        {props.items > 0 ?
          <h3 className="modal-title">{i18n.Compress} <span className="quot">({props.items})</span>?</h3> :
          <h3 className="modal-title rename">{i18n.Compress} <span className="quot">&quot;{props.fName}&quot;</span>?</h3>}
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={`${props.path}/${props.fName}.tar.gz`} onBlur={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{i18n.Compress}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{i18n.Compress}</button>
      </div>
    </div>
  );
}

export default Archive;