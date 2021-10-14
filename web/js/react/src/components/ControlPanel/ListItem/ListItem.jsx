import React, { Component } from 'react';
import Container from '../Container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ListItem.scss';

class ListItem extends Component {
  state = {
    starred: false
  }

  UNSAFE_componentWillMount() {
    this.setState({ starred: this.props.starred === 1 });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      starred: nextProps.starred === 1
    });
  }

  printDate = date => {
    if (date) {
      let newDate = new Date(date);
      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return <div className="date">{day} &nbsp; {months[month - 1]} &nbsp; {year}</div>;
    }
  }

  toggleItem = () => {
    this.props.checkItem();
  }

  starItem = () => {
    this.setState({ starred: !this.state.starred }, () => {
      this.props.toggleFav(this.state.starred);
    });
  }

  className = () => {
    const { starred } = this.state;
    const { checked, outdated, suspended, stopped, focused, sysInfo } = this.props;
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

  render() {
    return (
      <div className={this.className()} id={this.props.id}>
        <Container className="l-col w-14">
          {this.printDate(this.props.date)}
          <div className="text-status">
            <div className="checkbox"><input type="checkbox" onChange={(e) => this.toggleItem(e)} checked={this.props.checked} /></div>
            {this.props.leftNameText}
          </div>
          <div className="star">
            <div className="checkbox"><input type="checkbox" onChange={(e) => this.toggleItem(e)} checked={this.props.checked} /></div>
            <div onClick={this.starItem}><FontAwesomeIcon icon="star" /></div>
          </div>
          {this.props.suspended && <div className='suspended'>{window.GLOBAL.App.i18n.suspended}</div>}
        </Container>
        {this.props.children}
      </div>
    );
  }
}

export default ListItem;