import React from 'react';
import { useSelector } from 'react-redux';

import Dropdown from './Dropdown/Dropdown';
import './Path.scss';

const Path = ({ path, isActive, className, openDirectory, changeSorting, sorting, order }) => {
  const { user } = useSelector(state => state.menuCounters);

  const clickablePath = () => {
    let splitPath = path.split('/');
    splitPath.splice(0, 3);

    if (path !== user.HOME) {
      return (
        splitPath.map((item, index) => <span className="clickable" key={index} onClick={() => openDirectoryHandler(index)}>&nbsp;/&nbsp;{item}</span>)
      );
    }
  }

  const openDirectoryHandler = index => {
    let pathArray = path.split('/');

    if (!isActive) {
      return;
    } else {
      if (index !== undefined) {
        let newPathArray = pathArray.splice(0, index + 4);
        let newPath = newPathArray.join('/');
        openDirectory(newPath);
      }
    }
  }

  return (
    <div className={className}>
      <div className="clickable-wrapper">
        <span className="clickable-path">
          <span className="clickable" onClick={() => openDirectory(user.HOME)}>{user.HOME}</span>
          {clickablePath()}
        </span>
      </div>
      <Dropdown changeSorting={changeSorting} sorting={sorting} order={order} isActive={isActive} />
    </div>
  );
}

export default Path;
