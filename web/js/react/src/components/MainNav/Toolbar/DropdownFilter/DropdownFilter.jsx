import React, { Component } from 'react';
import './DropdownFilter.scss';
const { i18n } = window.GLOBAL.App;

class DropdownFilter extends Component {
  state = {
    usersList: [i18n.Date, i18n.Username, i18n.Disk, i18n.Bandwidth, i18n.Starred],
    webList: [i18n.Date, i18n.Domain, i18n['IP Addresses'], i18n.Disk, i18n.Bandwidth, i18n.Starred],
    dnsList: [i18n.Date, i18n.Expire, i18n.Domain, i18n['IP Addresses'], i18n.Records, i18n.Starred],
    mailList: [i18n.Date, i18n.Domain, i18n.Accounts, i18n.Disk, i18n.Starred],
    mailAccountList: [i18n.Date, i18n.Accounts, i18n.Disk, i18n.Starred],
    dbList: [i18n.Date, i18n.Database, i18n.Disk, i18n.User, i18n.Host, i18n.Starred],
    cronList: [i18n.Date, i18n.Command, i18n.Starred],
    packagesList: [i18n.Date, i18n['Package Name'], i18n.Starred],
    internetProtocolsList: [i18n.Date, i18n.IP, i18n.Netmask, i18n.Interface, i18n.Domain, i18n.Owner, i18n.Starred],
    firewallList: [i18n.Action, i18n.Protocol, i18n.Port, i18n['IP Addresses'], i18n.Comment, i18n.Starred],
    searchList: [i18n.Date, i18n.Name, i18n.Starred]
  }

  changeSorting = (type, order) => {
    this.props.changeSorting(type, order);
  }

  filterClassName = (sorting, order) => {
    if (this.props.sorting === sorting && this.props.order === order) {
      return "dropdown-item active";
    }

    return "dropdown-item";
  }

  renderFilters = () => {
    const { list } = this.props;
    let activeListFilter = this.state[list];

    return activeListFilter.map((item, index) => {
      return (
        <li key={index}>
          <span className={this.filterClassName(item, "descending")} onClick={() => this.changeSorting(item, "descending")}>{item}<span className="arrow-down">&#8595;</span></span>
          <span className={this.filterClassName(item, "ascending")} onClick={() => this.changeSorting(item, "ascending")}><span>&#8593;</span></span>
        </li>
      );
    });
  }

  button = () => {
    if (this.props.order === "descending") {
      return <span className="arrow-down">&#8595;</span>;
    } else {
      return <span>&#8593;</span>;
    }
  }

  render() {
    return (
      <div className="btn-group">
        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {i18n['sort by']}: <b>{this.props.sorting}</b>
          {this.button()}
        </button>
        <div className="dropdown-menu">
          <ul className="dropdown-list">
            {this.renderFilters()}
          </ul>
        </div>
      </div >
    );
  }
}

export default DropdownFilter;