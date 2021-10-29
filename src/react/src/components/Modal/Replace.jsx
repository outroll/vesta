import React from 'react';

const Replace = (props) => {
  return (
    <div className="modal-content replace">
      <div className="modal-header">
        {props.files.length > 1 ?
          <div><h3>These files already exist</h3>
            {props.files.map(item =>
              <span className="quot">&quot;{item.name}&quot; </span>
            )}
          </div> :
          <div><h3>This file already exists</h3>
            <span className="quot">&quot;{props.files[0].name}&quot;</span>
          </div>
        }
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary mr-auto" onClick={props.close}>Cancel</button>
        <button type="button" className="btn btn-danger" onClick={() => props.replace(props.files)}>Overwrite</button>
      </div>
    </div>
  );
}

export default Replace;