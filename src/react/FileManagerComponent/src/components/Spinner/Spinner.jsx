import React from 'react';
import './Spinner.scss';

const Spinner = () => {
  return (
    <div className="spinner-wrapper">
      <div className="progress">
        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: "100%" }}></div>
      </div>
    </div>
  );
}

export default Spinner;