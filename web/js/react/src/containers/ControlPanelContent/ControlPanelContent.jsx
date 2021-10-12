import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addActiveElement, removeFocusedElement } from "../../actions/MainNavigation/mainNavigationActions";
import EditInternetProtocol from '../../components/InternetProtocol/Edit/EditInternetProtocol';
import AddInternetProtocol from '../../components/InternetProtocol/Add/AddInternetProtocol';
import EditServerNginx from 'src/components/Server/Edit/Nginx/EditServerNginx';
import Postgresql from 'src/components/Server/Edit/Postgresql/Postgresql';
import EditBackupExclusions from 'src/components/Backup/Exclusion/Edit';
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import InternetProtocols from '../InternetProtocols/InternetProtocols';
import AddWebDomain from '../../components/WebDomain/Add/AddWebDomain';
import EditDatabase from '../../components/Database/Edit/EditDatabase';
import EditFirewall from '../../components/Firewall/Edit/EditFirewall';
import Hotkeys from '../../components/ControlPanel/Hotkeys/Hotkeys';
import AddDatabase from '../../components/Database/Add/AddDatabase';
import AddFirewall from '../../components/Firewall/Add/AddFirewall';
import EditCronJob from '../../components/CronJob/Edit/EditCronJob';
import EditPackage from '../../components/Package/Edit/EditPackage';
import EditHttpd from 'src/components/Server/Edit/Httpd/EditHttpd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddCronJob from '../../components/CronJob/Add/AddCronJob';
import AddPackage from '../../components/Package/Add/AddPackage';
import EditServer from '../../components/Server/Edit/EditServer';
import Dovecot from 'src/components/Server/Edit/Dovecot/Dovecot';
import EditMailWrapper from '../EditMailWrapper/EditMailWrapper';
import Service from 'src/components/Server/Edit/Service/Service';
import AddMailWrapper from '../AddMailWrapper/AddMailWrapper';
import EditDNSWrapper from '../EditDNSWrapper/EditDNSWrapper';
import EditWeb from '../../components/WebDomain/Edit/EditWeb';
import EditPhp from 'src/components/Server/Edit/PHP/EditPhp';
import Databases from '../../containers/Databases/Databases';
import Firewalls from '../../containers/Firewalls/Firewalls';
import EditUser from '../../components/User/Edit/EditUser';
import Bind9 from 'src/components/Server/Edit/Bind9/Bind9';
import Mysql from 'src/components/Server/Edit/Mysql/Mysql';
import AddDNSWrapper from '../AddDNSWrapper/AddDNSWrapper';
import BackupWrapper from '../BackupWrapper/BackupWrapper';
import AddBanIP from 'src/components/Firewall/Add/Banlist';
import CronJobs from '../../containers/CronJobs/CronJobs';
import Packages from '../../containers/Packages/Packages';
import { services } from 'src/ControlPanelService/Server';
import AddUser from '../../components/User/Add/AddUser';
import Updates from '../../containers/Updates/Updates';
import Servers from '../../containers/Servers/Servers';
import MainNav from '../../components/MainNav/MainNav';
import BackupExclusions from '../Backups/Exclusions';
import MailWrapper from '../MailWrapper/MailWrapper';
import DNSWrapper from '../DNSWrapper/DNSWrapper';
import Statistics from '../Statistics/Statistics';
import Users from '../../containers/Users/Users';
import RRDs from '../../containers/RRDs/RRDs';
import BanList from '../Firewalls/Banlist';
import Web from '../../containers/Web/Web';
import Search from '../Search/Search';
import Logs from '../Logs/Logs';

import './ControlPanelContent.scss';

const ControlPanelContent = props => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [hotkeysList, setHotkeysList] = useState(null);
  const { user, token } = useSelector(state => state.session);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && !token) {
      history.push('/login/');
    }
  }, []);

  useEffect(() => {
    dispatch(removeFocusedElement());
    window.addEventListener("keyup", switchPanelTab);
    window.addEventListener("keyup", addNewObject);

    return () => {
      window.addEventListener("keyup", switchPanelTab);
      window.addEventListener("keyup", addNewObject);
    }
  }, []);

  const switchPanelTab = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (isSearchInputFocused) {
      return;
    }

    switch (event.keyCode) {
      case 49: history.push('/list/user/'); return dispatchActiveElement('/list/user/');
      case 50: history.push('/list/web/'); return dispatchActiveElement('/list/web/');
      case 51: history.push('/list/dns/'); return dispatchActiveElement('/list/dns/');
      case 52: history.push('/list/mail/'); return dispatchActiveElement('/list/mail/');
      case 53: history.push('/list/db/'); return dispatchActiveElement('/list/db/');
      case 54: history.push('/list/cron/'); return dispatchActiveElement('/list/cron/');
      case 55: history.push('/list/backup/'); return dispatchActiveElement('/list/backup/');
      default: break;
    }
  }

  const dispatchActiveElement = tab => {
    dispatch(addActiveElement(tab));
  }

  const addNewObject = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (isSearchInputFocused) {
      return;
    }

    if (event.keyCode === 65) {
      switch (history.location.pathname) {
        case '/list/user/': return history.push('/add/user/');
        case '/list/web/': return history.push('/add/web/');
        case '/list/dns/': return history.push('/add/dns/');
        case '/list/mail/': return history.push('/add/mail/');
        case '/list/db/': return history.push('/add/db/');
        case '/list/cron/': return history.push('/add/cron/');
        case '/list/backup/exclusions': return history.push('/edit/backup/exclusions/');
        case '/list/package/': return history.push('/add/package/');
        case '/list/ip/': return history.push('/add/ip/');
        case '/list/firewall/': return history.push('/add/firewall/');
        default: break;
      }
    }
  }

  const handleSearchTerm = searchTerm => {
    setSearchTerm(searchTerm);
    history.push({
      pathname: '/search/',
      search: `?q=${searchTerm}`
    });
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <MainNav history={history} />
      <div className="content">
        <Switch>
          <Redirect from="/" exact to="/list/user" />
          <Route path="/list/package" component={props => <Packages {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/package" component={() => <AddPackage />} />
          <Route path="/edit/package" component={() => <EditPackage />} />
          <Route path="/list/ip" component={props => <InternetProtocols {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/ip" component={() => <AddInternetProtocol />} />
          <Route path="/edit/ip" component={() => <EditInternetProtocol />} />
          <Route path="/list/rrd" component={props => <RRDs {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/list/stats" component={props => <Statistics {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/list/log" component={props => <Logs {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/list/updates" component={props => <Updates {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/list/firewall" exact component={props => <Firewalls {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/list/firewall/banlist" exact component={props => <BanList {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/firewall/banlist" component={AddBanIP} />
          <Route path="/add/firewall" component={() => <AddFirewall />} />
          <Route path="/edit/firewall" component={() => <EditFirewall />} />
          <Route path="/list/server/" exact component={props => <Servers {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/edit/server/" exact component={() => <EditServer />} />
          <Route path="/edit/server/nginx" exact component={() => <EditServerNginx />} />
          <Route path="/edit/server/php" exact component={() => <EditPhp serviceName="php" />} />
          <Route path="/edit/server/php-fpm" exact component={() => <EditPhp serviceName="php-fpm" />} />
          <Route path="/edit/server/php5-fpm" exact component={() => <EditPhp serviceName="php5-fpm" />} />
          <Route path="/edit/server/httpd" exact component={() => <EditHttpd />} />
          <Route path="/edit/server/dovecot" exact component={() => <Dovecot />} />
          <Route path="/edit/server/bind9" exact component={() => <Bind9 />} />
          <Route path="/edit/server/postgresql" exact component={() => <Postgresql />} />
          <Route path="/edit/server/mysql" exact component={() => <Mysql serviceName="mysql" />} />
          <Route path="/edit/server/mariadb" exact component={() => <Mysql serviceName="mariadb" />} />
          <Route path="/edit/server/mysqld" exact component={() => <Mysql serviceName="mysqld" />} />

          {
            !!services.length && services.map((service, index) => {
              if (service === 'iptables') {
                return <Redirect key={index} from="/edit/server/iptables" exact to="/list/firewall" />
              } else {
                return <Route key={index} path={`/edit/server/${service}`} exact component={() => <Service serviceName={service} />} />
              }
            })
          }

          <Route path="/list/user" component={props => <Users {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/user" component={() => <AddUser />} />
          <Route path="/edit/user" component={() => <EditUser />} />
          <Route path="/list/web" component={props => <Web {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/web" component={() => <AddWebDomain />} />
          <Route path="/edit/web" component={() => <EditWeb />} />
          <Route path="/list/dns" component={props => <DNSWrapper {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/dns" component={() => <AddDNSWrapper />} />
          <Route path="/edit/dns" component={() => <EditDNSWrapper />} />
          <Route path="/list/mail" component={props => <MailWrapper {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/mail" component={() => <AddMailWrapper />} />
          <Route path="/edit/mail" component={() => <EditMailWrapper />} />
          <Route path="/list/db" component={props => <Databases {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/db" component={() => <AddDatabase />} />
          <Route path="/edit/db" component={() => <EditDatabase />} />
          <Route path="/list/cron" component={props => <CronJobs {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route path="/add/cron" component={() => <AddCronJob />} />
          <Route path="/edit/cron" component={() => <EditCronJob />} />
          <Route exact path="/list/backup" component={props => <BackupWrapper {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route exact path="/list/backup/exclusions" component={props => <BackupExclusions {...props} changeSearchTerm={handleSearchTerm} />} />
          <Route exact path="/edit/backup/exclusions" component={EditBackupExclusions} />
          <Route path="/search/" component={props => <Search {...props} changeSearchTerm={handleSearchTerm} searchTerm={searchTerm} />} />
        </Switch>
      </div>
      <div className="fixed-buttons">
        <div className="hotkey-button">
          <button onClick={() => hotkeysList.classList.toggle('hide')}>
            <FontAwesomeIcon icon="ellipsis-h" />
          </button>
        </div>
        <div className="scroll-to-top">
          <button onClick={() => scrollToTop()}>
            <FontAwesomeIcon icon="long-arrow-alt-up" />
          </button>
        </div>
      </div>
      <Hotkeys reference={(inp) => setHotkeysList(inp)} toggleHotkeys={() => hotkeysList.classList.toggle('hide')} />
    </div>
  );
}

export default ControlPanelContent;