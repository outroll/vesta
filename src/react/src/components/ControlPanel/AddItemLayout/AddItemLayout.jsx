import React from 'react';
import Container from '../Container/Container';

import './AddItemLayout.scss';

const AddItemLayout = ({ date = '', time = '', status = '', children }) => {
  const renderDate = () => {
    if (date.length > 0) {
      let newDate = new Date(date);
      let day = newDate.getDate();
      let month = newDate.getMonth();
      let year = newDate.getFullYear();
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return <div className="date">{day} &nbsp; {months[month]} &nbsp; {year}</div>;
    }
  }

  return (
    <div className="edit-item">
      <Container className="l-col w-14">
        {renderDate()}
        <div className="time">
          {time}
        </div>
        <div className="status uppercase">
          {status}
        </div>
      </Container>
      {children}
    </div>
  );
}

export default AddItemLayout;