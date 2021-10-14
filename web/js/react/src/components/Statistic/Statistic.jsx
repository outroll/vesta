import React from 'react';
import Container from '../ControlPanel/Container/Container';
import './Statistic.scss';

const Statistic = props => {
  const { data } = props;
  const { i18n } = window.GLOBAL.App;

  const printDate = date => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return <div className="date">{day} &nbsp; {months[month]} &nbsp; {year}</div>;
  }

  const printName = date => {
    let newDate = new Date(date);
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return <div className="date">{months[month]} &nbsp; {year}</div>;
  }

  return (
    <div className={data.FOCUSED ? 'statistic-item focused' : 'statistic-item'} id={data.NAME}>
      <Container className="l-col w-15">
        {printDate(data.DATE)}
      </Container>
      <Container className="r-col w-85">
        <div className="name">{printName(data.DATE)}</div>
        <div className="stats">
          <Container className="c-1">
            <div className="bandwidth">{i18n.Bandwidth} <span><span className="stat">{data.U_BANDWIDTH}</span>{i18n.mb}</span></div>
            <div className="disk">{i18n.Disk}: <span><span className="stat">{data.U_DISK}</span>{i18n.mb}</span></div>
            <div className="sub-disk-stats">
              <div>
                <div>{i18n.Web}: <span><span className="stat">{data.U_DISK_WEB}</span>{i18n.mb}</span></div>
                <div>{i18n.Mail}: <span><span className="stat">{data.U_DISK_MAIL}</span>{i18n.mb}</span></div>
              </div>
              <div>
                <div>{i18n.Databases}: <span><span className="stat">{data.U_DATABASES}</span>{i18n.mb}</span></div>
                <div>{i18n['User Directories']}: <span><span className="stat">{data.U_DISK_DIRS}</span>{i18n.mb}</span></div>
              </div>
            </div>
          </Container>
          <Container className="c-2">
            <div><span>{i18n['Web Domains']}:</span> <span className="stat">{data.U_WEB_DOMAINS}</span></div>
            <div><span>{i18n['SSL Domains']}:</span> <span className="stat">{data.U_WEB_SSL}</span></div>
            <div><span>{i18n['Web Aliases']}:</span> <span className="stat">{data.U_WEB_ALIASES}</span></div>
            <div><span>{i18n['DNS Domains']}:</span> <span className="stat">{data.U_DNS_DOMAINS}</span></div>
            <div><span>{i18n['DNS records']}:</span> <span className="stat">{data.U_DNS_RECORDS}</span></div>
          </Container>
          <Container className="c-3">
            <div><span>{i18n['Mail Domains']}:</span> <span className="stat">{data.U_MAIL_DOMAINS}</span></div>
            <div><span>{i18n['Mail Accounts']}:</span> <span className="stat">{data.U_MAIL_ACCOUNTS}</span></div>
            <div><span>{i18n['Databases']}:</span> <span className="stat">{data.U_DATABASES}</span></div>
            <div><span>{i18n['Cron Jobs']}:</span> <span className="stat">{data.U_CRON_JOBS}</span></div>
            <div><span>{i18n['IP Addresses']}:</span> <span className="stat">{data.IP_OWNED}</span></div>
          </Container>
        </div>
      </Container>
    </div>
  );
}

export default Statistic;