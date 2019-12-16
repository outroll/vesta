import React from 'react';
import './Path.scss';
import Dropdown from './Dropdown/Dropdown';

function clickablePath(props) {
  let path = props.path;
  let splitPath = props.path.split('/');
  splitPath.splice(0, 3);

  if (path !== window.GLOBAL.ROOT_DIR) {
    return (
      splitPath.map((item, index) => <span className="clickable" key={index} onClick={() => openDirectory(props, index)}>&nbsp;/&nbsp;{item}</span>)
    );
  }
}

function openDirectory(props, index) {
  let pathArray = props.path.split('/');

  if (!props.isActive) {
    return;
  } else {
    if (index !== undefined) {
      let newPathArray = pathArray.splice(0, index + 4);
      let newPath = newPathArray.join('/');
      props.openDirectory(newPath);
    }
  }
}

const Path = (props) => {
  return (
    <div className={props.class}>
      <div className="clickable-wrapper">
        <span className="clickable-path">
          <span className="clickable" onClick={() => props.openDirectory(window.GLOBAL.ROOT_DIR)}>{window.GLOBAL.ROOT_DIR}</span>
          {clickablePath(props)}
        </span>
      </div>
      <Dropdown changeSorting={props.changeSorting} sorting={props.sorting} order={props.order} isActive={props.isActive} />
    </div>
  );
}

export default Path;