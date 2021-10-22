import React from 'react';
import { useSelector } from 'react-redux';

import Dropdown from './Dropdown/Dropdown';
import './Path.scss';

const Path = ({ path, isActive, className, openDirectory, changeSorting, sorting, order }) => {
  const session = useSelector(state => state.session);

  const clickablePath = () => {
    let splitPath = path.split('/');
    splitPath.splice(0, 3);

    if (path !== session.user.HOME) {
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
          <span className="clickable" onClick={() => openDirectory(session.user.HOME)}>{session.user.HOME}</span>
          {clickablePath()}
        </span>
      </div>
      <Dropdown changeSorting={changeSorting} sorting={sorting} order={order} isActive={isActive} />
    </div>
  );
}

export default Path;
