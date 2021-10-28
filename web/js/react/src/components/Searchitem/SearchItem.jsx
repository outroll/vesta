import React from 'react';
import { loginAs, logout } from 'src/actions/Session/sessionActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import './SearchItem.scss';

const SearchItem = ({ data, handleModal }) => {
  const { i18n, userName } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const history = useHistory()

  const signInAs = user => {
    dispatch(loginAs(user)).then(() => history.push('/'));
  }

  const signOut = () => {
    dispatch(logout()).then(() => history.push('/'));
  }

  const handleDelete = () => {
    handleModal(data.delete_confirmation, `/api/v1/${data.TYPE === 'user' ? `/api/v1/delete/user/index.php?user=${data.USER}` : data.delete_link}`);
  }

  const handleSuspend = () => {
    handleModal(data.spnd_confirmation, `/api/v1/${data.TYPE === 'user' ? `${data.spnd_action}/user/index.php?user=${data.USER}` : data.spnd_link}`);
  }

  const printLoginActionButton = () => {
    if (data.TYPE !== 'user') return;

    if (userName === data.USER) {
      return (
        <div>
          <button onClick={signOut}>{i18n['Log out']}
            {data.FOCUSED ? <span className="shortcut-button">L</span> : <FontAwesomeIcon icon="user-lock" />}
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button onClick={() => signInAs(data.USER)}>{i18n['login as']} {data.USER}
            {data.FOCUSED ? <span className="shortcut-button">L</span> : <FontAwesomeIcon icon="user-lock" />}
          </button>
        </div>
      );
    }
  }

  return (
    <ListItem date={data.DATE} suspended={data.SUSPENDED === 'yes'}>
      <Container className="search-list r-col w-85">
        <div className="name">{data.RESULT}</div>
        <div className="stats">
          <Container className="c-1">
            <div className="object">{data.TYPE === 'user' ? i18n['USER'] : i18n[data.object]}</div>
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
        {printLoginActionButton()}
        <div><Link className="link-edit" to={data.edit_link}>{i18n.edit} <FontAwesomeIcon icon="pen" /></Link></div>
        <div>
          <button
            className="link-gray"
            onClick={handleSuspend}>
            {data.spnd_action}
            <FontAwesomeIcon icon={data.SUSPENDED === 'yes' ? 'unlock' : 'lock'} />
          </button>
        </div>
        <div>
          <button
            className="link-delete"
            onClick={handleDelete}>
            {i18n.Delete}
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
      </div>
    </ListItem>
  );
}

export default SearchItem;
