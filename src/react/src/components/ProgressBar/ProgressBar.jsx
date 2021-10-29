import React from 'react';
import './ProgressBar.scss';

const ProgressBar = (props) => {
  return (
    <div class="progress">
      <div class="progress-bar" role="progressbar" style={{ width: `${props.progress}%` }} aria-valuenow={props.progress} aria-valuemin="0" aria-valuemax="100"></div>
    </div>
  );
}

export default ProgressBar;