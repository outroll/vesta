import React, { useEffect } from 'react';
import { addActiveElement } from '../../../actions/MainNavigation/mainNavigationActions';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

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
  const { activeElement, focusedElement } = useSelector(state => state.mainNavigation);
  const { i18n, session: { look } } = useSelector(state => state.session);
  const { user } = useSelector(state => state.menuCounters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.LANGUAGE) {
      localStorage.setItem("language", user.LANGUAGE);
    }
  }, [user]);

  const handleState = (tab, event) => {
    if (`${window.location.pathname}${window.location.search}` === tab) {
      return event.preventDefault();
    }

    dispatch(addActiveElement(tab));
  }

  const statClassName = activeName => {
    return `stat ${activeName === activeElement && 'l-active'} ${activeName === focusedElement && 'focus'}`;
  }

  const sizeFormatter = (bytes, decimals) => {
    if (!bytes) return null;

    if (bytes === "0") {
      return <span className="value">0 <span className="unit">b</span></span>;
    }

    let k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['b', 'kb', 'Mb', 'GB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return (<span className="value">{parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} <span className="unit">{sizes[i]}</span></span>);
  }

  return (
    <div className="menu-wrapper">
      <div className={className(props.menuHeight)} style={{ height: style(props) }}>
        <div className={statClassName("/list/user/")}>
          <Link to="/list/user/" onClick={event => handleState("/list/user/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.USER}</h3>
            <div className="stats">
              {
                look
                  ? (<>
                    <div><span>{i18n.Disk}:</span> <span>{sizeFormatter(user.U_DISK)}</span></div>
                    <div><span>{i18n.Bandwidth}:</span> <span>{sizeFormatter(user.U_BANDWIDTH)}</span></div>
                  </>)
                  : (<>
                    <div><span>{i18n.users}:</span> <span>{user.U_USERS}</span></div>
                    <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_USERS}</span></div>
                  </>)
              }
            </div>
          </Link>
        </div>
        <div className={statClassName("/list/web/")}>
          <Link to="/list/web/" onClick={event => handleState("/list/web/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.WEB}</h3>
            <div className="stats">
              <div><span>{i18n.domains}:</span> <span>{user.U_WEB_DOMAINS}</span></div>
              <div><span>{i18n.aliases}:</span> <span>{user.U_WEB_ALIASES}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_WEB}</span></div>
            </div>
          </Link>
        </div>
        <div className={statClassName("/list/dns/")}>
          <Link to="/list/dns/" onClick={event => handleState("/list/dns/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.DNS}</h3>
            <div className="stats">
              <div><span>{i18n.domains}:</span> <span>{user.U_DNS_DOMAINS}</span></div>
              <div><span>{i18n.records}:</span> <span>{user.U_DNS_RECORDS}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_DNS}</span></div>
            </div>
          </Link>
        </div>
        <div className={statClassName("/list/mail/")}>
          <Link to="/list/mail/" onClick={event => handleState("/list/mail/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.MAIL}</h3>
            <div className="stats">
              <div><span>{i18n.domains}:</span> <span>{user.U_MAIL_DOMAINS}</span></div>
              <div><span>{i18n.accounts}:</span> <span>{user.U_MAIL_ACCOUNTS}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_MAIL}</span></div>
            </div>
          </Link>
        </div>
        <div className={statClassName("/list/db/")}>
          <Link to="/list/db/" onClick={event => handleState("/list/db/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.DB}</h3>
            <div className="stats">
              <div><span>{i18n.databases}:</span> <span>{user.U_DATABASES}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_DB}</span></div>
            </div>
          </Link>
        </div>
        <div className={statClassName("/list/cron/")}>
          <Link to="/list/cron/" onClick={event => handleState("/list/cron/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.CRON}</h3>
            <div className="stats">
              <div><span>{i18n.jobs}:</span> <span>{user.U_CRON_JOBS}</span></div>
              <div><span>{i18n.spnd}:</span> <span>{user.SUSPENDED_CRON}</span></div>
            </div>
          </Link>
        </div>
        <div className={statClassName("/list/backup/") + ' last'}>
          <Link to="/list/backup/" onClick={event => handleState("/list/backup/", event)} onKeyPress={event => event.preventDefault()}>
            <h3>{i18n.BACKUP}</h3>
            <div className="stats">
              <div><span>{i18n.backups}:</span> <span>{user.U_BACKUPS}</span></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
