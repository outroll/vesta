import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addActiveElement, removeFocusedElement } from "../../actions/MainNavigation/mainNavigationActions";
import EditInternetProtocol from '../../components/InternetProtocol/Edit/EditInternetProtocol';
import AddInternetProtocol from '../../components/InternetProtocol/Add/AddInternetProtocol';
import EditServerNginx from 'src/components/Server/Edit/Nginx/EditServerNginx';
import Postgresql from 'src/components/Server/Edit/Postgresql/Postgresql';
import EditBackupExclusions from 'src/components/Backup/Exclusion/Edit';
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router";
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
import Spinner from 'src/components/Spinner/Spinner';
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
  const { userName } = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [hotkeysList, setHotkeysList] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userName) {
      return navigate('/login');
    } else {
      setLoading(false);
    }
  }, [userName]);

  useEffect(() => {
    dispatch(removeFocusedElement());
    window.addEventListener("keyup", switchPanelTab);
    window.addEventListener("keyup", addNewObject);

    return () => {
      window.removeEventListener("keyup", switchPanelTab);
      window.removeEventListener("keyup", addNewObject);
    }
  }, []);

  const switchPanelTab = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (isSearchInputFocused) {
      return;
    }

    switch (event.keyCode) {
      case 49: return navigate('/list/user/');
      case 50: return navigate('/list/web/');
      case 51: return navigate('/list/dns/');
      case 52: return navigate('/list/mail/');
      case 53: return navigate('/list/db/');
      case 54: return navigate('/list/cron/');
      case 55: return navigate('/list/backup/');
      default: break;
    }
  }

  const addNewObject = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (isSearchInputFocused) {
      return;
    }

    if (event.keyCode === 65) {
      switch (location.pathname) {
        case '/list/web/': return navigate('/add/web/');
        case '/list/dns/': return navigate('/add/dns/');
        case '/list/mail/': return navigate('/add/mail/');
        case '/list/db/': return navigate('/add/db/');
        case '/list/cron/': return navigate('/add/cron/');
        case '/list/backup/exclusions': return navigate('/edit/backup/exclusions/');
        case '/list/package/': return navigate('/add/package/');
        case '/list/ip/': return navigate('/add/ip/');
        case '/list/firewall/': return navigate('/add/firewall/');
        default: break;
      }
    }
  }

  const handleSearchTerm = searchTerm => {
    setSearchTerm(searchTerm);
    navigate({
      pathname: '/search/',
      search: `?q=${searchTerm}`
    });
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const historyShim = { push: navigate };

  return (
    <div>
      <MainNav />
      <div className="content">
        {
          loading
            ? <Spinner />
            : (
              <Routes>
                <Route path="/" element={<Navigate to="/list/user/" replace />} />
                <Route path="/list/package" element={<Packages history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/package" element={<AddPackage />} />
                <Route path="/edit/package" element={<EditPackage />} />
                <Route path="/list/ip" element={<InternetProtocols history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/ip" element={<AddInternetProtocol />} />
                <Route path="/edit/ip" element={<EditInternetProtocol />} />
                <Route path="/list/rrd" element={<RRDs history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/list/stats" element={<Statistics history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/list/log" element={<Logs history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/list/updates" element={<Updates history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/list/firewall" element={<Firewalls history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/list/firewall/banlist" element={<BanList history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/firewall/banlist" element={<AddBanIP />} />
                <Route path="/add/firewall" element={<AddFirewall />} />
                <Route path="/edit/firewall" element={<EditFirewall />} />
                <Route path="/list/server/" element={<Servers history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/edit/server/" element={<EditServer />} />
                <Route path="/edit/server/nginx" element={<EditServerNginx />} />
                <Route path="/edit/server/php" element={<EditPhp serviceName="php" />} />
                <Route path="/edit/server/php-fpm" element={<EditPhp serviceName="php-fpm" />} />
                <Route path="/edit/server/php5-fpm" element={<EditPhp serviceName="php5-fpm" />} />
                <Route path="/edit/server/httpd" element={<EditHttpd />} />
                <Route path="/edit/server/dovecot" element={<Dovecot />} />
                <Route path="/edit/server/bind9" element={<Bind9 />} />
                <Route path="/edit/server/postgresql" element={<Postgresql />} />
                <Route path="/edit/server/mysql" element={<Mysql serviceName="mysql" />} />
                <Route path="/edit/server/mariadb" element={<Mysql serviceName="mariadb" />} />
                <Route path="/edit/server/mysqld" element={<Mysql serviceName="mysqld" />} />

                {
                  !!services.length && services.map((service, index) => {
                    if (service === 'iptables') {
                      return <Route key={index} path="/edit/server/iptables" element={<Navigate to="/list/firewall" replace />} />
                    } else {
                      return <Route key={index} path={`/edit/server/${service}`} element={<Service serviceName={service} />} />
                    }
                  })
                }

                <Route path="/list/user" element={<Users changeSearchTerm={handleSearchTerm} history={historyShim} />} />
                <Route path="/add/user" element={<AddUser />} />
                <Route path="/edit/user" element={<EditUser />} />
                <Route path="/list/web" element={<Web history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/web" element={<AddWebDomain />} />
                <Route path="/edit/web" element={<EditWeb />} />
                <Route path="/list/dns" element={<DNSWrapper history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/dns" element={<AddDNSWrapper />} />
                <Route path="/edit/dns" element={<EditDNSWrapper />} />
                <Route path="/list/mail" element={<MailWrapper history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/mail" element={<AddMailWrapper />} />
                <Route path="/edit/mail" element={<EditMailWrapper />} />
                <Route path="/list/db" element={<Databases history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/db" element={<AddDatabase />} />
                <Route path="/edit/db" element={<EditDatabase />} />
                <Route path="/list/cron" element={<CronJobs history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/add/cron" element={<AddCronJob />} />
                <Route path="/edit/cron" element={<EditCronJob />} />
                <Route path="/list/backup" element={<BackupWrapper history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/list/backup/exclusions" element={<BackupExclusions history={historyShim} changeSearchTerm={handleSearchTerm} />} />
                <Route path="/edit/backup/exclusions" element={<EditBackupExclusions />} />
                <Route path="/search/" element={<Search history={historyShim} changeSearchTerm={handleSearchTerm} searchTerm={searchTerm} />} />
              </Routes>
            )}
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
