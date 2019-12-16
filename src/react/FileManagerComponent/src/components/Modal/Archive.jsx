import React from 'react';

const Archive = (props) => {
  return (
    <div className="modal-content">
      <div className="modal-header">
        {props.items > 0 ?
          <h3 className="modal-title">{window.GLOBAL.App.Constants.FM_PACK} <span className="quot">({props.items})</span>?</h3> :
          <h3 className="modal-title rename">{window.GLOBAL.App.Constants.FM_PACK} <span className="quot">&quot;{props.fName}&quot;</span>?</h3>}
      </div>
      <div className="modal-body">
        <input type="text" autoFocus defaultValue={`${props.path}/${props.fName}.tar.gz`} onBlur={props.onChange} ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{window.GLOBAL.App.Constants.FM_CANCEL}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{window.GLOBAL.App.Constants.FM_PACK_BUTTON}</button>
      </div>
    </div>
  );
}

export default Archive;