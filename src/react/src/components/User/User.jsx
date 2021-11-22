import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import './User.scss';

const User = ({ data, toggleFav, handleModal, checkItem, logOut, logInAs }) => {
  const { i18n, userName } = useSelector(state => state.session);

  const printNameServers = servers => {
    let serversArray = servers.split(',');

    return serversArray.map(
      (server, index) => <div key={index}>{server}</div>
    );
  }

  const printLoginActionButton = user => {
    let currentUser = userName;
    if (currentUser === user) {
      return (
        <div>
          <button onClick={logOut}>{i18n['Log out']}
            {data.FOCUSED ? <span className="shortcut-button">L</span> : <FontAwesomeIcon icon="user-lock" />}
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={() => logInAs(user)}>{i18n['login as']} {user}
            {data.FOCUSED ? <span className="shortcut-button">L</span> : <FontAwesomeIcon icon="user-lock" />}
          </button>
        </div>
      );
    }
  }

  const toggleFavorite = (starred) => {
    if (starred) {
      toggleFav(data.NAME, 'add');
    } else {
      toggleFav(data.NAME, 'delete');
    }
  }

  const checkItemName = () => {
    checkItem(data.NAME);
  }

  const handleSuspend = () => {
    let suspendedStatus = data.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';
    handleModal(data.spnd_conf, `/api/v1/${suspendedStatus}/user/index.php?user=${data.NAME}`);
  }

  const handleDelete = () => {
    handleModal(data.delete_conf, `/api/v1/delete/user/index.php?user=${data.NAME}`);
  }

  return (
    <ListItem
      id={data.NAME}
      date={data.DATE}
      checked={data.isChecked}
      starred={data.STARRED}
      toggleFav={toggleFavorite}
      checkItem={checkItemName}
      focused={data.FOCUSED}
      suspended={data.SUSPENDED === 'yes'}>

      <Container className="r-col w-85">
        <div className="name">{data.NAME}</div>
        <div>{data.FNAME} {data.LNAME}</div>
        <div className="stats">
          <Container className="c-1">
            <div className="bandwidth">
              {i18n.Bandwidth}
              <span><span className="stat">{data.U_BANDWIDTH}</span> {data.U_BANDWIDTH_MEASURE}</span>
              <div className="percent" style={{ width: `${data.U_BANDWIDTH_PERCENT}%` || '0%' }}></div>
            </div>
            <div className="disk">
              {i18n.Disk}: <span><span className="stat">{data.U_DISK}</span> {data.U_DISK_MEASURE}</span>
              <div className="percent" style={{ width: `${data.U_DISK_PERCENT}%` || '0%' }}></div>
            </div>
            <div className="sub-disk-stats">
              <div>
                <div><span>{i18n.Web}:</span> <span><b>{data.U_DISK_WEB}</b> {data.U_DISK_WEB_MEASURE}</span></div>
                <div><span>{i18n.Mail}:</span> <span><b>{data.U_DISK_MAIL}</b> {data.U_DISK_MAIL_MEASURE}</span></div>
              </div>
              <div>
                <div><span>{i18n.Databases}:</span> <span><b>{data.U_DATABASES}</b> {data.U_DATABASES_MEASURE}</span></div>
                <div><span>{i18n['User Directories']}:</span> <span><b>{data.U_DISK_DIRS}</b> {data.U_DISK_DIRS_MEASURE}</span></div>
              </div>
            </div>
          </Container>
          <Container className="c-2">
            <div><span>{i18n['Web Domains']}:</span> <span><b>{data.U_WEB_DOMAINS}</b> / {data.WEB_DOMAINS}</span></div>
            <div><span>{i18n['DNS Domains']}:</span> <span><b>{data.U_DNS_DOMAINS}</b> / {data.DNS_DOMAINS}</span></div>
            <div><span>{i18n['Mail Domains']}:</span> <span><b>{data.U_MAIL_DOMAINS}</b> / {data.MAIL_DOMAINS}</span></div>
            <div><span>{i18n.Databases}:</span> <span><b>{data.U_DATABASES}</b> / {data.DATABASES}</span></div>
            <div><span>{i18n['Cron Jobs']}:</span> <span><b>{data.U_CRON_JOBS}</b> / {data.CRON_JOBS}</span></div>
            <div><span>{i18n.Backups}:</span> <span><b>{data.U_BACKUPS}</b> / {data.BACKUPS}</span></div>
          </Container>
          <Container className="c-3">
            <div><span>{i18n.Email}:</span> <span className="stat email">{data.CONTACT}</span></div>
            <div><span>{i18n.Package}:</span> <span className="stat">{data.PACKAGE}</span></div>
            <div><span>{i18n['SSH Access']}:</span> <span className="stat">{data.SHELL}</span></div>
            <div><span>{i18n['IP Addresses']}:</span> <span className="stat">{data.IP_OWNED}</span></div>
            <div className="ns"><span>{i18n['Name Servers']}:</span> <span className="stat">{printNameServers(data.NS)}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        {printLoginActionButton(data.NAME)}
        <div>
          <Link to={`/edit/user?user=${data.NAME}`}>{i18n.edit}
            {data.FOCUSED ? <span className="shortcut-button html-unicode">&#8617;</span> : <FontAwesomeIcon icon="pen" />}
          </Link>
        </div>
        <div>
          <button
            className="link-gray"
            onClick={handleSuspend}>
            {data.spnd_action}
            {data.FOCUSED ? <span className="shortcut-button">S</span> : <FontAwesomeIcon icon={data.SUSPENDED === 'yes' ? 'unlock' : 'lock'} />}
          </button>
        </div>
        <div>
          <button className="link-delete" onClick={handleDelete}>
            {i18n.Delete}
            {data.FOCUSED ? <span className="shortcut-button del">Del</span> : <FontAwesomeIcon icon="times" />}
          </button>
        </div>
      </div>
    </ListItem>
  );
}

export default User;