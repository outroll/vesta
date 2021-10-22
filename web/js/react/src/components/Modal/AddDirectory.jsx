import React from 'react';
import { useSelector } from 'react-redux';


const AddDirectory = (props) => {
  const { i18n } = useSelector(state => state.session);

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