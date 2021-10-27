import React, { useState } from 'react';
import { addActiveElement } from 'src/actions/MainNavigation/mainNavigationActions';
import { logout } from 'src/actions/Session/sessionActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

import './TopPanel.scss';

const TopPanel = ({ menuItems = [], extraMenuItems = [] }) => {
  const mainNavigation = useSelector(state => state.mainNavigation);
  const [loading, setLoading] = useState(false);
  const { i18n, userName } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const history = useHistory();

  const className = cls => {
    let className = 'nav-link';

    if (mainNavigation.activeElement === cls) {
      return className += ' active';
    }

    return className;
  }

  const renderMenuItems = () => {
    if (!menuItems.length) return;

    return menuItems.map(({ route, name }) => (
      <div className={className(route)} key={name}>
        <button onClick={event => handleState(event, route)}>{name}</button>
      </div>
    ));
  }

  const renderExtraMenuItems = () => {
    if (!extraMenuItems.length) return;

    return extraMenuItems.map(({ link, text, type }, index) => (
      <div className="nav-link" key={index}>
        {
          type === 'download'
            ? <a href={`/api/v1${link}`} target="_blank" rel="noopener noreferrer">{text}</a>
            : <Link to={link} target="_blank">{text}</Link>
        }
      </div>
    ));
  }

  const handleState = (event, route) => {
    event.preventDefault();
    history.push(route);
    dispatch(addActiveElement(route));
  }

  const signOut = () => {
    setLoading(true);

    dispatch(logout())
      .then(() => {
        history.push('/login/');
        setLoading(false);
      },
        error => {
          setLoading(false);
          console.error(error);
        });
  }

  return (
    <div className="panel-wrapper">
      {loading && <Spinner />}

      <div className="top-panel">
        <div className="container left-menu">
          <div className="logo">
            <Link to="/list/user/">
              <div className="logo-img">
                <img src="/images/white_logo.png" alt="Logo" />
              </div>
            </Link>
          </div>

          {renderMenuItems()}

          {renderExtraMenuItems()}
        </div>

        <div className="container profile-menu">
          <div><Link to={`/edit/user?user=${userName}`}>{userName}</Link></div>
          <div><button className="log-out" onClick={signOut}>{i18n['Log out']}</button></div>
        </div>
      </div>
    </div>
  );
}

export default TopPanel;
