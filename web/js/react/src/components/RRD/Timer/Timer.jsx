import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Timer.scss';

const Timer = props => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(props.countDown, 1000);
    } else if (!isActive && props.time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, props.time]);

  const handlePause = () => {
    setIsActive(!isActive);
  }

  return (
    <div className="timer-wrapper">
      <button onClick={() => handlePause()}>
        {!isActive ? <FontAwesomeIcon icon="play" /> : <FontAwesomeIcon icon="pause" />}
      </button>
      <div className="circle-wrapper">
        {/* <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="stroke-1" cx="15" cy="15" r="10" fill="white" style={{ strokeDashoffset: 9 + props.time * 4.2 }}></circle>
          </svg> */}
        <span className="seconds">{props.time}</span>
      </div>
    </div>
  )
}

export default Timer;