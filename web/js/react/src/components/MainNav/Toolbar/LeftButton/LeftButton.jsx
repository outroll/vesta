import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './LeftButton.scss';
import { Link } from 'react-router-dom';

const LeftButton = ({ showLeftMenu, list, name, href, onClick = () => { } }) => {
  const leftMenuClassName = () => {
    if (!showLeftMenu) {
      return "l-menu none";
    }

    if (list === 'server') {
      return "l-menu server-icon";
    } else if (list === 'backup-details') {
      return "l-menu backup-details-icon";
    }

    return "l-menu";
  }

  const renderIcon = () => {
    if (list === 'server') {
      return <FontAwesomeIcon icon="cog" />
    } else if (list === 'backup-details') {
      return <FontAwesomeIcon icon="play" />
    }

    return <FontAwesomeIcon icon="plus" />
  }

  return (
    <div className={leftMenuClassName()}>
      {
        href
          ? (<Link to={href}>
            {renderIcon()}
            <span className="add">{name}</span>
          </Link>)
          : (<button onClick={onClick}>
            {renderIcon()}
            <span className="add">{name}</span>
          </button>)
      }
    </div>
  );
}

export default LeftButton;
