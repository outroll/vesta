import React from 'react';

const { i18n } = window.GLOBAL.App;

const AddDirectory = (props) => {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title directory" >{i18n['Create directory']}</h3>
      </div>
      <div className="modal-body">
        <input type="text" ref={props.reference} autoFocus></input>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{i18n.Cancel}</button>
        <button type="button" className="btn btn-primary" onClick={props.save}>{i18n.Create}</button>
      </div>
    </div>
  );
}

export default AddDirectory;