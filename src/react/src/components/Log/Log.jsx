import React from 'react';
import Container from '../ControlPanel/Container/Container';
import './Log.scss';

const Log = props => {
  const { data } = props;

  const printDate = date => {
    let newDate = new Date(date);
    let day = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return <div className="date">{day} &nbsp; {months[month]} &nbsp; {year}</div>;
  }

  return (
    <div className={data.FOCUSED ? 'statistic-item focused' : 'statistic-item'} id={data.NAME}>
      <Container className="l-col w-15">
        {printDate(data.DATE)}
        {data.TIME}
      </Container>
      <Container className="r-col w-85">
        <div className="name">{data.CMD}</div>
      </Container>
    </div>
  );
}

export default Log;