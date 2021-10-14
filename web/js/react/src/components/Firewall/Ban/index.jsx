import React from 'react';
import ListItem from 'src/components/ControlPanel/ListItem/ListItem';
import Container from 'src/components/ControlPanel/Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Ban = ({ data, ...props }) => {
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");

  const checkItem = () => {
    props.checkItem(data.NAME);
  }

  const handleDelete = () => {
    props.handleModal(data.delete_conf, `/api/delete/firewall/banlist/?ip=${data.NAME}&chain=${data.CHAIN}&token=${token}`);
  }

  return (
    <ListItem
      id={data.NAME}
      focused={data.FOCUSED}
      checked={data.isChecked}
      date={data.DATE}
      checkItem={checkItem}>
      <Container className="r-col w-85">
        <div className="stats">
          <Container className="c-1 w-35">
            <div><b>{data.DATE}</b> &nbsp; {data.TIME}</div>
          </Container>
          <Container className="c-2 w-30">
            <div></div>
          </Container>
          <Container className="c-2 w-30">
            <div>{data.CHAIN}</div>
          </Container>
          <Container className="c-2 w-30">
            <div>{data.NAME}</div>
          </Container>
        </div>
      </Container>
      <div className="actions">
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

export default Ban;