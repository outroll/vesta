import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import { Link } from 'react-router-dom';
import './Firewall.scss';

const Firewall = ({ data, ...props }) => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;

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
    let suspendedStatus = data.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';
    props.handleModal(data.suspend_conf, `/${suspendedStatus}/firewall/?rule=${data.NAME}&token=${token}`);
  }

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/delete/firewall/?rule=${data.NAME}&token=${token}`);
  }

  return (
    <ListItem
      id={data.NAME}
      date={data.DATE}
      starred={data.STARRED}
      focused={data.FOCUSED}
      checked={data.isChecked}
      toggleFav={toggleFav}
      checkItem={checkItem}
      suspended={data.SUSPENDED === 'yes'}>

      <Container className="cron-jobs-list r-col w-85">
        <div className="stats">
          <Container className="cron-col">
            <div><span className="stat">{data.ACTION}</span></div>
          </Container>
          <Container className="cron-col">
            <div><span><span className="stat">{data.PROTOCOL}</span> / {data.COMMENT}</span></div>
          </Container>
          <Container className="cron-col">
            <div></div>
          </Container>
          <Container className="cron-col">
            <div><span className="stat">{data.PORT}</span></div>
          </Container>
          <Container className="cron-col">
            <div><span className="stat">{data.IP}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <Link className="link-edit" to={`/edit/firewall/?rule=${data.NAME}`}>
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

export default Firewall;
