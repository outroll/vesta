import React from 'react';

const NothingSelected = (props) => {
  const { Constants } = window.GLOBAL.App;

  return (
    <div className="modal-content nothing-selected">
      <div className="header">
        {props.notAvailable ? <h3>{Constants.FM_DirDownloadNotAvailable}</h3> : <h3>{Constants.FM_NO_FILE_SELECTED}</h3>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger mr-auto" onClick={props.close}>{Constants.FM_CLOSE}</button>
      </div>
    </div>
  );
}

export default NothingSelected;