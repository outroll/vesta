import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { values } from '../../../../ControlPanelService/Select';
import './Select.scss';

const { i18n } = window.GLOBAL.App;
const listValues = values(i18n);

class Select extends Component {
  state = {
    usersList: listValues.usersList,
    webList: listValues.webList,
    dnsList: listValues.dnsList,
    mailList: listValues.mailList,
    dbList: listValues.dbList,
    cronList: listValues.cronList,
    backupList: listValues.backupList,
    packagesList: listValues.packagesList,
    internetProtocolsList: listValues.internetProtocolsList,
    statisticsList: [],
    updatesList: listValues.updatesList,
    firewallList: listValues.firewallList,
    serverList: listValues.serverList,
    backupDetailList: listValues.backupDetailList,
    banList: listValues.banList,
    selected: '',
  };

  defaultValue = () => {
    if (this.props.list === 'statisticsList') {
      return i18n['show per user'];
    }

    return i18n['apply to selected'];
  }

  componentDidMount() {
    const { list } = this.props;

    this.setState({ list });
  }

  renderOptions = () => {
    const { list } = this.props;
    let activeList = this.state[list];

    if (list === 'statisticsList') {
      return this.props.users.map((item, index) => { return <option key={index} value={item}>{item}</option> });
    } else {
      return activeList.map((item, index) => { return <option key={index} value={item.value}>{item.name}</option> });
    }
  }

  handleSelect = event => {
    this.setState({ selected: event.target.value });
  }

  bulkAction = () => {
    this.props.bulkAction(this.state.selected);
  }

  render() {
    return (
      <div className="select-wrapper">
        <select className="custom-select" id="inputGroupSelect04" onChange={this.handleSelect}>
          <option defaultValue={this.defaultValue()} value={this.defaultValue()}>{this.props.list === "statisticsList" ? i18n['show per user'] : i18n['apply to selected']}</option>
          {this.renderOptions()}
        </select>
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={this.bulkAction}>
            <FontAwesomeIcon icon="angle-right" />
          </button>
        </div>
      </div>
    );
  }
}

export default Select;