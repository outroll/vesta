import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ListItem from '../ControlPanel/ListItem/ListItem';
import Container from '../ControlPanel/Container/Container';
import { useSelector } from 'react-redux';
import './SearchItem.scss';
import { Link } from 'react-router-dom';

const SearchItem = ({ data, handleModal }) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <ListItem date={data.DATE} suspended={data.SUSPENDED === 'yes'}>
      <Container className="search-list r-col w-85">
        <div className="name">{data.RESULT}</div>
        <div className="stats">
          <Container className="c-1">
            <div className="object">{i18n[data.object]}</div>
          </Container>
          <Container className="c-2">
            <div className="owner">{i18n.Owner}: <span>{data.USER}</span></div>
          </Container>
          <Container className="c-3">
            <div className="status">{i18n.Status}: <span>{data.status}</span></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div><Link className="link-edit" to={data.edit_link}>{i18n.edit} <FontAwesomeIcon icon="pen" /></Link></div>
        <div>
          <button
            className="link-gray"
            onClick={() => handleModal(data.spnd_confirmation, '/api/v1' + data.spnd_link)}>
            {data.spnd_action}
            <FontAwesomeIcon icon={data.SUSPENDED === 'yes' ? 'unlock' : 'lock'} />
          </button>
        </div>
        <div>
          <button className="link-delete" onClick={() => this.props.handleModal(data.delete_confirmation, data, data.delete_link)}>
            {i18n.Delete}
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
      </div>
    </ListItem>
  );
}

export default SearchItem;
