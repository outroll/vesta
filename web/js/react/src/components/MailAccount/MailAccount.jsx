import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import { Link } from 'react-router-dom';

export default function MailAccount(props) {
  const { data, domain } = props;
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
    props.handleModal(data.suspend_conf, `/${suspendedStatus}/mail?domain=${domain}&account=${data.NAME}&token=${token}`);
  }

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/delete/mail?domain=${domain}&account=${data.NAME}&token=${token}`);
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
        <div className="name">{`${data.NAME}@${domain}`}</div>
        <div className="stats">
          <Container className="c-1">
            <div className="bandwidth">{i18n.Disk} <span><span className="stat">{data.U_DISK}</span>&nbsp;{i18n.mb}</span></div>
          </Container>
          <Container className="c-2">
            <div>{i18n['Quota']}: <span><span className="stat">{data.QUOTA}</span>&nbsp; {i18n.mb}</span></div>
            <div>{i18n['Forward to']}: <span className="stat email">{data.FWD}</span></div>
          </Container>
          <Container className="c-3">
            {printStat(i18n['Autoreply'], data.AUTOREPLY)}
          </Container>
        </div>
      </Container>
      <div className="actions">

        <div>
          <Link className="link-edit" to={`/edit/mail/?domain=${domain}&account=${data.NAME}`}>
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