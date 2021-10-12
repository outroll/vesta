import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItem from '../ControlPanel/ListItem/ListItem';
import Container from '../ControlPanel/Container/Container';
import './CronJob.scss';
import { Link } from 'react-router-dom';

const CronJob = props => {
  const { data } = props;
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");

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
    props.handleModal(data.suspend_conf, `/${suspendedStatus}/cron/?job=${data.NAME}&token=${token}`);
  }

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/delete/cron/?job=${data.NAME}&token=${token}`);
  }

  return (
    <ListItem
      id={data.NAME}
      date={data.DATE}
      checkItem={checkItem}
      toggleFav={toggleFav}
      focused={data.FOCUSED}
      starred={data.STARRED}
      checked={data.isChecked}
      suspended={data.SUSPENDED === 'yes'}>

      <Container className="cron-jobs-list r-col w-85">
        <div className="name">{data.CMD}</div>
        <div className="stats">
          <Container className="cron-col">
            <div>{i18n.Min} <span>{data.MIN}</span></div>
          </Container>
          <Container className="cron-col">
            <div>{i18n.Hour} <span>{data.HOUR}</span></div>
          </Container>
          <Container className="cron-col">
            <div>{i18n.Day} <span>{data.DAY}</span></div>
          </Container>
          <Container className="cron-col">
            <div>{i18n.Month} <span>{data.MONTH}</span></div>
          </Container>
          <Container className="cron-col">
            <div>{i18n['Day of week']} <span>{data.WDAY}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">

        <div>
          <Link className="link-edit" to={`/edit/cron/?job=${data.NAME}`}>
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

export default CronJob;