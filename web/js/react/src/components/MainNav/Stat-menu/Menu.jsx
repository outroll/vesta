import React, { useEffect } from 'react';
import { addActiveElement } from '../../../actions/MainNavigation/mainNavigationActions';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import './Menu.scss';

const className = height => {
  if (height === 35) {
    return "menu-stat shadow";
  } else {
    return "menu-stat";
  }
}

const style = ({ menuHeight, mobile }) => {
  if (mobile) {
    return;
  }

  if (document.documentElement.clientWidth > 900) {
    return menuHeight
  } else {
    return 45;
  }
}

const Menu = props => {
  const session = useSelector(state => state.session);
  const { activeElement, focusedElement } = useSelector(state => state.mainNavigation);
  const { user } = useSelector(state => state.session);
  const { i18n } = window.GLOBAL.App;
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (user.LANGUAGE) {
      localStorage.setItem("language", user.LANGUAGE);
    }
  }, [user]);

  const handleState = (tab, event) => {
    event.preventDefault();
    history.push(tab);
    dispatch(addActiveElement(tab));
  }

  const statClassName = activeName => {
    return `stat ${activeName === activeElement && 'l-active'} ${activeName === focusedElement && 'focus'}`;
  }

  return (
    <div className="menu-wrapper">
      <div className={className(props.menuHeight)} style={{ height: style(props) }}>
        <div className={statClassName("/list/user/")}>
          <button onClick={event => handleState("/list/user/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.USER}</h3>
            <div className="stats">
              <div><span>{i18n.users}:</span> <span>{user.U_USERS}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_USERS}</span></div>
            </div>
          </button>
        </div>
        <div className={statClassName("/list/web/")}>
          <button onClick={event => handleState("/list/web/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.WEB}</h3>
            <div className="stats">
              <div><span>{i18n.domains}:</span> <span>{user.U_WEB_DOMAINS}</span></div>
              <div><span>{i18n.aliases}:</span> <span>{user.U_WEB_ALIASES}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_WEB}</span></div>
            </div>
          </button>
        </div>
        <div className={statClassName("/list/dns/")}>
          <button onClick={event => handleState("/list/dns/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.DNS}</h3>
            <div className="stats">
              <div><span>{i18n.domains}:</span> <span>{user.U_DNS_DOMAINS}</span></div>
              <div><span>{i18n.records}:</span> <span>{user.U_DNS_RECORDS}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_DNS}</span></div>
            </div>
          </button>
        </div>
        <div className={statClassName("/list/mail/")}>
          <button onClick={event => handleState("/list/mail/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.MAIL}</h3>
            <div className="stats">
              <div><span>{i18n.domains}:</span> <span>{user.U_MAIL_DOMAINS}</span></div>
              <div><span>{i18n.accounts}:</span> <span>{user.U_MAIL_ACCOUNTS}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_MAIL}</span></div>
            </div>
          </button>
        </div>
        <div className={statClassName("/list/db/")}>
          <button onClick={event => handleState("/list/db/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.DB}</h3>
            <div className="stats">
              <div><span>{i18n.databases}:</span> <span>{user.U_DATABASES}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_DB}</span></div>
            </div>
          </button>
        </div>
        <div className={statClassName("/list/cron/")}>
          <button onClick={event => handleState("/list/cron/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.CRON}</h3>
            <div className="stats">
              <div><span>{i18n.jobs}:</span> <span>{user.U_CRON_JOBS}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_CRON}</span></div>
            </div>
          </button>
        </div>
        <div className={statClassName("/list/backup/") + ' last'}>
          <button onClick={event => handleState("/list/backup/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.BACKUP}</h3>
            <div className="stats">
              <div><span>{i18n.backups}:</span> <span>{user.U_BACKUPS}</span></div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;