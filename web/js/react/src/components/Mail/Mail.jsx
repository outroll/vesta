import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import { Link } from 'react-router-dom';
import './Mail.scss';

const Mail = props => {
  const { data } = props;
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");
  const printStat = (stat, text) => {
    if (text === 'no') {
      return <div className="crossed">{stat}</div>;
    }

    return <div>{stat}: <span className="stat">{text}</span></div>;
  }

  const toggleFav = (starred) => {
    if (starred) {
      props.toggleFav(props.data.NAME, 'add');
    } else {
      props.toggleFav(props.data.NAME, 'delete');
    }
  }

  const checkItem = () => {
    props.checkItem(props.data.NAME);
  }

  const handleSuspend = () => {
    let suspendedStatus = data.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend' === 'yes' ? 'unsuspend' : 'suspend';
    props.handleModal(data.suspend_conf, `/${suspendedStatus}/mail?domain=${data.NAME}&token=${token}`);
  }

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/delete/mail?domain=${data.NAME}&token=${token}`);
  }

  return (
    <ListItem
      id={data.NAME}
      focused={data.FOCUSED}
      checked={data.isChecked}
      date={data.DATE}
      starred={data.STARRED}
      toggleFav={toggleFav}
      checkItem={checkItem}
      suspended={data.SUSPENDED === 'yes'}>

      <Container className="r-col w-85">
        <div className="name">{data.NAME}</div>
        <div className="stats">
          <Container className="c-1">
            <div className="bandwidth">{i18n.Disk} <span><span className="stat">{data.U_DISK}</span>{i18n.mb}</span></div>
          </Container>
          <Container className="c-2">
            {printStat(i18n['AntiVirus Support'], data.ANTIVIRUS)}
            {printStat(i18n['DKIM Support'], data.DKIM)}
          </Container>
          <Container className="c-3">
            {printStat(i18n['AntiSpam Support'], data.ANTISPAM)}
            <div>{i18n['Catchall email']}: <span className="stat">{data.CATCHALL}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <Link className="link-gray" to={`/list/mail/?domain=${data.NAME}`}>
            {data.list_accounts_button}
            {data.FOCUSED ? <span className="shortcut-button">L</span> : <FontAwesomeIcon icon="list" />}
          </Link>
        </div>

        <div>
          <Link className="link-edit" to={`/add/mail/?domain=${data.NAME}`}>
            {i18n['add account']}
            {data.FOCUSED ? <span className="shortcut-button">N</span> : <FontAwesomeIcon icon="plus" />}
          </Link>
        </div>

        <div>
          <Link className="link-edit" to={`/edit/mail/?domain=${data.NAME}`}>
            {i18n.edit}
            {data.FOCUSED ? <span className="shortcut-button html-unicode">&#8617;</span> : <FontAwesomeIcon icon="pen" />}
          </Link>
        </div>

        <div>
          <button
            className="link-gray"
            onClick={() => handleSuspend()}>
            {i18n[data.suspend_action]}
            {data.FOCUSED ? <span className="shortcut-button">S</span> : <FontAwesomeIcon icon={data.SUSPENDED === 'yes' ? 'unlock' : 'lock'} />}
          </button>
        </div>

        <div>
          <button className="link-delete" onClick={() => handleDelete()}>
            {i18n.Delete}
            {data.FOCUSED ? <span className="shortcut-button del">Del</span> : <FontAwesomeIcon icon="times" />}
          </button>
        </div>
      </div>
    </ListItem>
  );
}

export default Mail;