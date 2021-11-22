import React from 'react';
import Menu from '../../MainNav/Stat-menu/Menu';
import { addActiveElement } from '../../../actions/MainNavigation/mainNavigationActions';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import './MobileTopNav.scss';

const MobileTopNav = props => {
  const { i18n, userName } = useSelector(state => state.session);
  const { session } = useSelector(state => state.userSession);
  const { activeElement, focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();

  const className = (activeName, extraClass = '') => {
    let className = 'top-link';

    if (activeName === activeElement) {
      className += ' active';
    }

    if (activeName === focusedElement) {
      className += ' focus';
    }

    return className + ` ${extraClass}`;
  }

  const handleState = (tab, event) => {
    if (`${window.location.pathname}${window.location.search}` === tab) {
      return event.preventDefault();
    }

    dispatch(addActiveElement(tab));
  }

  return (
    <div className={props.class}>
      <div className="mobile-menu">
        {userName === 'admin' && (<>
          <div className={className("/list/package/")}>
            <Link to="/list/package/" onClick={event => handleState("/list/package/", event)} onKeyPress={event => event.preventDefault()}>{i18n.Packages}</Link>
          </div>
          <div className={className("/list/ip/")}>
            <Link to="/list/ip/" onClick={event => handleState("/list/ip/", event)} onKeyPress={event => event.preventDefault()}>{i18n.IP}</Link>
          </div>
          <div className={className("/list/rrd/")}>
            <Link to="/list/rrd/" onClick={event => handleState("/list/rrd/", event)} onKeyPress={event => event.preventDefault()}>{i18n.Graphs}</Link>
          </div>
        </>)}
        <div className={className("/list/stats/")}>
          <Link to="/list/stats/" onClick={event => handleState("/list/stats/", event)} onKeyPress={event => event.preventDefault()}>{i18n.Statistics}</Link>
        </div>
        <div className={className("/list/log/")}>
          <Link to="/list/log/" onClick={event => handleState("/list/log/", event)} onKeyPress={event => event.preventDefault()}>{i18n.Log}</Link>
        </div>
        {userName === 'admin' && (<>
          <div className={className("/list/updates/")}>
            <Link to="/list/updates/" onClick={event => handleState("/list/updates/", event)} onKeyPress={event => event.preventDefault()}>{i18n.Updates}</Link>
          </div>
          {session.FIREWALL_SYSTEM && <div className={className("/list/firewall/")}>
            <Link to="/list/firewall/" onClick={event => handleState("/list/firewall/", event)} onKeyPress={event => event.preventDefault()}>{i18n.Firewall}</Link>
          </div>}
        </>)}
        {session.FILEMANAGER_KEY && <div className={className("/list/directory/")}>
          <Link to="/list/directory/">{i18n['File Manager']}</Link>
        </div>}
        {session.SOFTACULOUS === "yes" && <div className={className("/softaculous/")}><Link to="/softaculous/" target="_blank">{i18n.Apps ?? 'Apps'}</Link>
        </div>}
        {userName === 'admin' && (
          <div className={className("/list/server/")}>
            <Link to="/list/server/" onClick={event => handleState("/list/server/", event)} onKeyPress={event => event.preventDefault()}>{i18n.Server}</Link>
          </div>
        )}
      </div>
      <div className="mobile-stat-menu">
        <Menu mobile={true} />
      </div>
    </div>
  );
}

export default MobileTopNav;
