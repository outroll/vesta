import React, { } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import './Package.scss';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Package = props => {
  const { data } = props;
  const { i18n } = useSelector(state => state.session);

  const printNameServers = servers => {
    let serversArray = servers.split(',');

    return serversArray.map(
      (server, index) => <div key={index}>{server}</div>
    );
  }

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
    props.handleModal(data.delete_conf, `/api/v1/delete/package/index.php?package=${data.NAME}`);
  }

  return (
    <ListItem
      id={data.NAME}
      date={data.DATE}
      toggleFav={toggleFav}
      checkItem={checkItem}
      starred={data.STARRED}
      focused={data.FOCUSED}
      checked={data.isChecked}>

      <Container className="r-col w-85">
        <div className="name">{data.NAME}</div>
        <div>{data.FNAME} {data.LNAME}</div>
        <div className="stats">
          <Container className="c-1 w-30">
            <div>{i18n['Web Template']}: <span><span className="stat">{data.WEB_TEMPLATE}</span></span></div>
            <div>{i18n['Proxy Template']}: <span><span className="stat">{data.PROXY_TEMPLATE}</span></span></div>
            <div>{i18n['DNS Template']}: <span><span className="stat">{data.DNS_TEMPLATE}</span></span></div>
            <div>{i18n['SSH Access']}: <span><span className="stat">{data.SHELL}</span></span></div>
            <div>{i18n['Web Domains']}: <span><span className="stat">{data.WEB_DOMAINS}</span></span></div>
            <div>{i18n['Web Aliases']}: <span><span className="stat">{data.WEB_ALIASES}</span></span></div>
          </Container>
          <Container className="c-2 w-35">
            <div>{i18n['DNS domains']}: <span><span className="stat">{data.DNS_DOMAINS}</span></span></div>
            <div>{i18n['DNS records']}: <span><span className="stat">{data.DNS_RECORDS}</span></span></div>
            <div>{i18n['Mail Domains']}: <span><span className="stat">{data.MAIL_DOMAINS}</span></span></div>
            <div>{i18n['Mail Accounts']}: <span><span className="stat">{data.MAIL_ACCOUNTS}</span></span></div>
            <div>{i18n.Databases}: <span><span className="stat">{data.DATABASES}</span></span></div>
            <div>{i18n['Cron Jobs']}: <span><span className="stat">{data.CRON_JOBS}</span></span></div>
          </Container>
          <Container className="c-3 w-35">
            <div><span>{i18n.Backups}:</span> <span><span className="stat">{data.BACKUPS}</span></span></div>
            <div><span>{i18n.Bandwidth}:</span> <span><span><span className="stat">{data.BANDWIDTH}</span> {i18n.mb}</span></span></div>
            <div><span>{i18n.Disk}:</span> <span><span><span className="stat">{data.DISK_QUOTA}</span> {i18n.mb}</span></span></div>
            <div className="ns"><span>{i18n['Name Servers']}:</span> <span><span className="stat">{printNameServers(data.NS)}</span></span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <Link className="link-edit" to={`/edit/package/?package=${data.NAME}`}>
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

export default Package;