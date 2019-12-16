import React from 'react';
// import video from '../../../2.mp4';
import './Video.scss';

const Video = (props) => {
  return (
    <div className="video-preview">
      <span className="close" onClick={props.closeModal}>&times;</span>
      <video className="video" autoPlay loop controls>
        <source src="" type="video/mp4" />
      </video>
    </div>
  );
}

export default Video;