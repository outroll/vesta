import React, { Component, useEffect, useState } from 'react';
import Container from '../Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import './ListItem.scss';

const ListItem = (props) => {
  const { i18n } = useSelector(state => state.session);
  const [state, setState] = useState({ starred: false });

  useEffect(() => {
    if (props.hasOwnProperty('starred')) {
      setState({ ...state, starred: Boolean(props.starred) });
    }
  }, [props.starred]);

  const printDate = date => {
    if (date) {
      let newDate = new Date(date);
      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return <div className="date">{day} &nbsp; {months[month - 1]} &nbsp; {year}</div>;
    }
  }

  const toggleItem = () => {
    props.checkItem();
  }

  const starItem = () => {
    setState({ ...state, starred: !state.starred });
    props.toggleFav(!state.starred);
  }

  const className = () => {
    const { starred } = state;
    const { checked, outdated, suspended, stopped, focused, sysInfo } = props;
    let className = 'list-item';

    if (checked) {
      className += ' toggled';
    }

    if (starred) {
      className += ' starred';
    }

    if (outdated) {
      className += ' outdated';
    }

    if (suspended) {
      className += ' suspended';
    }

    if (stopped) {
      className += ' stopped';
    }

    if (focused) {
      className += ' focused';
    }

    if (sysInfo) {
      className += ' sys-info';
    }

    return className;
  }

  return (
    <div className={className()} id={props.id}>
      <Container className="l-col w-14">
        {printDate(props.date)}
        <div className="text-status">
          <div className="checkbox"><input type="checkbox" onChange={toggleItem} checked={props.checked} /></div>
          {props.leftNameText}
        </div>
        <div className="star">
          <div className="checkbox"><input type="checkbox" onChange={toggleItem} checked={props.checked} /></div>
          <div onClick={starItem}><FontAwesomeIcon icon="star" /></div>
        </div>
        {props.suspended && <div className='suspended'>{i18n.suspended}</div>}
      </Container>
      {props.children}
    </div>
  );
}

export default ListItem;
