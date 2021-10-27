import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DnsRecord({ data, domain, handleModal, ...props }) {
  const { i18n } = useSelector(state => state.session);

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
    handleModal(data.delete_conf, `/api/v1/delete/dns/?domain=${domain}&record_id=${data.ID}`);
  }

  const handleSuspend = () => {
    handleModal(data.suspend_conf, `/api/v1/${data.suspend_action}/dns/?domain=${domain}&record_id=${data.ID}`);
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
        <div className="name">{data.dnsRecord}</div>
        <br />
        <div className="stats">
          <Container className="c-1">
            <span className="stat">{`${data.RECORD.substring(0, 12)}${data.RECORD.length > 12 ? '...' : ''}`}</span>
          </Container>
          <Container className="c-2">
            <span className="stat">{data.TYPE}</span>
          </Container>
          <Container className="c-3">
            <span className="stat">{data.PRIORITY}</span>
          </Container>
          <Container className="c-4 long-value">
            <span className="stat">{data.VALUE}</span>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <Link className="link-edit" to={`/edit/dns/?domain=${domain}&record_id=${data.ID}`}>
            {i18n.edit}
            {data.FOCUSED ? <span className="shortcut-button html-unicode">&#8617;</span> : <FontAwesomeIcon icon="pen" />}
          </Link>
        </div>

        <div>
          <button
            className="link-gray"
            onClick={handleSuspend}>
            {data.suspend_action}
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