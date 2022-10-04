import React, { useState } from 'react';
import { useSelector } from 'react-redux';


const AddDirectory = (props) => {
  const [value, setValue] = useState(null)
  const { i18n } = useSelector(state => state.session);
  const [hasError, setHasError] = useState(value !== null && !value.length)

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const save = () => {
    if (!value) {
      setHasError(true)
      return;
    }
    props.save()
  }

  const cancel = () => {
    props.close()
  }

  return (
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title directory" >{i18n['Create directory']}</h3>
      </div>
      <div className="modal-body">
        <input type="text" onChange={onChange} ref={props.reference}></input>
        {hasError && <small className='error'>{i18n['Directory name cannot be empty']}</small>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={cancel}>{i18n.Cancel}</button>
        <button type="button" className="btn btn-primary" onClick={save}>{i18n.Create}</button>
      </div>
    </div>
  );
}

export default AddDirectory;