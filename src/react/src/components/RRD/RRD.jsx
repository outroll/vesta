import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import Container from '../ControlPanel/Container/Container';
import { generateImagePath } from '../../ControlPanelService/RRD';
import './RRD.scss';
import { useSelector } from 'react-redux';

const RRD = props => {
  const { data } = props;
  const { i18n } = useSelector(state => state.session);

  const printDate = date => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return <div className="date">{day} &nbsp; {months[month]} &nbsp; {year}</div>;
  }

  return (
    <div className={data.FOCUSED ? 'rrd-item focused' : 'rrd-item'} id={data.NAME}>
      <Container className="l-col w-15">
        {printDate(data.DATE)}
      </Container>
      <Container className="r-col w-85">
        <div className="name">{i18n[data.NAME]}</div>
        <div className="stats">
          <Container className="w-100">
            <div><img src={generateImagePath(props.period, data.TYPE, data.RRD)} alt="img" /></div>
          </Container>
        </div>
      </Container>
      <div className="actions">
        <div>
          <a className="link-download" href={generateImagePath(props.period, data.TYPE, data.RRD)}>
            {i18n.download}
            <FontAwesomeIcon icon={faFileDownload} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default RRD;