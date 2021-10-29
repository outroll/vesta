import React, { } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItem from '../ControlPanel/ListItem/ListItem';
import Container from '../ControlPanel/Container/Container';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons'
import './Backup.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Backup = props => {
  const { data } = props;
  const { i18n } = useSelector(state => state.session);
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

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/api/v1/delete/backup/?backup=${data.NAME}`);
  }

  return (
    <ListItem
      id={data.NAME}
      date={data.DATE}
      toggleFav={toggleFav}
      checkItem={checkItem}
      focused={data.FOCUSED}
      starred={data.STARRED}
      checked={data.isChecked}>

      <Container className="r-col w-85">
        <div className="name">{data.NAME}</div>
        <div className="stats">
          <Container className="c-1">
            <div>{i18n['Backup Size']}: <span><span className="stat">{data.SIZE}</span>{i18n.mb}</span></div>
          </Container>
          <Container className="c-2">
            <div>{i18n.Type}: <span className="stat">{data.TYPE}</span></div>
          </Container>
          <Container className="c-3">
            <div>{i18n['Run Time']}: <span className="stat">{data.RUNTIME} minute</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">

        {data.UPDATED === 'no' && <div><a href={`/update/vesta/?pkg=${data.NAME}`}>{i18n.update} <FontAwesomeIcon icon="wrench" /></a></div>}

        <div>
          <a className="link-download" href={`/api/v1/download/backup/?backup=${data.NAME}&token=${token}`}>
            {i18n.download}
            {data.FOCUSED ? <span className="shortcut-button">D</span> : <FontAwesomeIcon icon={faFileDownload} />}
          </a>
        </div>

        <div>
          <Link className="link-download" to={`/list/backup?backup=${data.NAME}`}>
            {i18n['configure restore settings']}
            {data.FOCUSED ? <span className="shortcut-button html-unicode">&#8617;</span> : <FontAwesomeIcon icon="list" />}
          </Link>
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

export default Backup;