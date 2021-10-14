import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../../ControlPanel/Container/Container';
import ListItem from '../../ControlPanel/ListItem/ListItem';
import { Link } from 'react-router-dom';

import './RestoreSetting.scss';

export default function RestoreSetting({ data, checkItemFunc = () => { }, restoreSetting = () => { } }) {
  const { i18n } = window.GLOBAL.App;

  const displayBackupDetailName = type => {
    switch (type) {
      case 'WEB': return `WEB ${i18n['domain']}`;
      case 'MAIL': return `MAIL ${i18n['domain']}`;
      case 'DNS': return `DNS ${i18n['domain']}`;
      case 'CRON': return i18n['cron'];
      case 'UDIR': return i18n['user dir'];
      default: return i18n['domain'];
    }
  }

  const checkItem = () => {
    checkItemFunc(data.NAME);
  }

  return (
    <ListItem
      date={false}
      id={data.NAME}
      focused={data.FOCUSED}
      checked={data.isChecked}
      checkItem={checkItem}>

      <Container className="r-col w-85">
        <div className="stats">
          <Container className="c-1">
            <div style={{ textTransform: 'uppercase' }}>{displayBackupDetailName(data.type)}</div>
          </Container>
          <Container className="c-2">
            <b>{data.name}</b>
          </Container>
          <Container className="c-3"></Container>
          <Container className="c-4"></Container>
          <Container className="c-5"></Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <button className="link-restore" onClick={() => restoreSetting(data.restoreLinkParams)}>
            {i18n['restore']}
            {data.FOCUSED ? <span className="shortcut-button">R</span> : <FontAwesomeIcon icon="play" />}
          </button>
        </div>
      </div>
    </ListItem>
  );
}