import React from 'react';

const AddFile = (props) => {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title" >{window.GLOBAL.App.Constants.FM_CREATE_FILE}</h3>
      </div>
      <div className="modal-body">
        <input type="text" ref={props.reference}></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{window.GLOBAL.App.Constants.FM_CANCEL}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{window.GLOBAL.App.Constants.FM_CREATE}</button>
      </div>
    </div>
  );
}

export default AddFile;