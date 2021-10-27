import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { values } from '../../../../ControlPanelService/Select';
import { useSelector } from 'react-redux';
import './Select.scss';

const Select = ({ cronReports, ...props }) => {
  const { i18n } = useSelector(state => state.session);
  const listValues = values(i18n);

  const [state, setState] = useState({
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
  });

  useEffect(() => {
    const { list } = props;
    setState({ ...state, list });
  }, []);

  const defaultValue = () => {
    if (props.list === 'statisticsList') {
      return i18n['show per user'];
    }

    return i18n['apply to selected'];
  }

  const renderOptions = () => {
    const { list } = props;
    let activeList = state[list];

    if (list === 'cronList') {
      if (cronReports) {
        activeList = activeList.filter((item, index) => index !== 0);
      } else {
        activeList = activeList.filter((item, index) => index !== 1);
      }
    }

    if (list === 'statisticsList') {
      return props.users.map((item, index) => { return <option key={index} value={item}>{item}</option> });
    } else {
      return activeList.map((item, index) => { return <option key={index} value={item.value}>{item.name}</option> });
    }
  }

  const handleSelect = event => {
    setState({ ...state, selected: event.target.value });
  }

  const bulkAction = () => {
    props.bulkAction(state.selected);
    setState({ ...state, selected: '' });
  }

  return (
    <div className="select-wrapper">
      <select className="custom-select" id="inputGroupSelect04" onChange={handleSelect}>
        <option defaultValue={defaultValue()} value={defaultValue()}>{props.list === "statisticsList" ? i18n['show per user'] : i18n['apply to selected']}</option>
        {renderOptions()}
      </select>
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="button" onClick={bulkAction}>
          <FontAwesomeIcon icon="angle-right" />
        </button>
      </div>
    </div>
  );
}

export default Select;
