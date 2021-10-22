import React, { Component } from 'react';
import ListItem from '../ControlPanel/ListItem/ListItem';
import Container from '../ControlPanel/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './InternetProtocol.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const InternetProtocol = props => {
  const { data } = props;
  const { i18n } = useSelector(state => state.session);
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

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/api/v1/delete/ip/?ip=${data.NAME}`);
  }

  return (
    <ListItem
      id={data.NAME}
      focused={data.FOCUSED}
      checked={data.isChecked}
      date={data.DATE}
      starred={data.STARRED}
      toggleFav={toggleFav}
      checkItem={checkItem}>

      <Container className="r-col w-85">
        <div className="name">{data.NAME}</div>
        <br />
        <div className="stats">
          <Container className="c-1 w-35">
            <div className="ip"><span className="stat">{data.NETMASK}</span></div>
            <div className="soa"><span className="stat">{data.INTERFACE}</span></div>
          </Container>
          <Container className="c-2 w-30">
            <div>{i18n.Domains}: <span className="stat">{data.U_WEB_DOMAINS}</span></div>
            <div>{i18n.Status}: <span className="stat">{data.STATUS}</span></div>
          </Container>
          <Container className="c-3 w-35">
            <div>{i18n.Owner}: <span className="stat">{data.OWNER}</span></div>
            <div>{i18n.Users}: <span className="stat">{data.U_SYS_USERS.replace(',', ', ')}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <Link className="link-edit" to={`/edit/ip/?ip=${data.NAME}`}>
            {i18n.edit}
            {data.FOCUSED ? <span className="shortcut-button html-unicode">&#8617;</span> : <FontAwesomeIcon icon="pen" />}
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

export default InternetProtocol;