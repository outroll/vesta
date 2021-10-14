import React from 'react';
import ListItem from '../ControlPanel/ListItem/ListItem';
import Container from '../ControlPanel/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const Database = props => {
  const { data } = props;
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");

  const toggleFav = (starred) => {
    if (starred) {
      props.toggleFav(data.NAME, 'add');
    } else {
      props.toggleFav(data.NAME, 'delete');
    }
  }

  const checkItem = () => {
    props.checkItem(data.NAME);
  }

  const handleSuspend = () => {
    let suspendedStatus = data.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend' === 'yes' ? 'unsuspend' : 'suspend';
    props.handleModal(data.suspend_conf, `/${suspendedStatus}/db/?database=${data.NAME}&token=${token}`);
  }

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/delete/db/?database=${data.NAME}&token=${token}`);
  }

  return (
    <ListItem
      id={data.NAME}
      date={data.DATE}
      toggleFav={toggleFav}
      checkItem={checkItem}
      starred={data.STARRED}
      focused={data.FOCUSED}
      checked={data.isChecked}
      suspended={data.SUSPENDED === 'yes'}>

      <Container className="r-col w-85">
        <div className="name">{data.DATABASE}</div>
        <br />
        <div className="stats">
          <Container className="c-1">
            <div className="disk">{i18n.Disk}: <span><span className="stat">{data.U_DISK}</span>{i18n.mb}</span></div>
          </Container>
          <Container className="c-2">
            <div>{i18n.User}: <span className="stat">{data.DBUSER}</span></div>
            <div>{i18n.Charset}: <span className="stat">{data.CHARSET}</span></div>
          </Container>
          <Container className="c-3">
            <div>{i18n.Host}: <span className="stat">{data.HOST}</span></div>
            <div>{i18n.Type}: <span className="stat">{data.TYPE}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <Link className="link-edit" to={`/edit/db/?database=${data.NAME}`}>
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

export default Database;