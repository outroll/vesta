import React, { Component } from 'react';
import Menu from '../../MainNav/Stat-menu/Menu';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import './MobileTopNav.scss';

class MobileTopNav extends Component {
  render() {
    return (
      <div className={this.props.class}>
        <div className="mobile-menu">
          <div>
            <div>Packages</div>
            <div>IP</div>
            <div>Graphs</div>
            <div>Statistics</div>
            <div>Log</div>
          </div>
          <div>
            <div>Updates</div>
            <div>Firewall</div>
            <div className="fm">File Manager</div>
            <div>Apps</div>
            <div>Server</div>
          </div>
        </div>
        <div className="mobile-stat-menu">
          <Menu mobile={true} />
        </div>
        <div className="mobile-toolbar">
          <Toolbar mobile={true} />
        </div>
      </div>
    );
  }
}

export default MobileTopNav;