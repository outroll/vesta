import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { generatorOptions } from '../../../../ControlPanelService/GeneratorOptions';

const RunCommandSelect = props => {
  const { i18n } = useSelector(state => state.session);

  const [state, setState] = useState({
    activeTab: ''
  });

  useEffect(() => {
    setState({ ...state, activeTab: props.activeTab });
  }, [props]);

  const renderOptions = () => {
    const { daysRunCommandsOptions, hoursRunCommandsOptions, minutesRunCommandsOptions, monthlyRunCommandOptions, weeklyRunCommandOptions } = generatorOptions(i18n);

    switch (state.activeTab) {
      case '1': return minutesRunCommandsOptions.map(option => <option value={option.value}>{option.name}</option>);
      case '2': return hoursRunCommandsOptions.map(option => <option value={option.value}>{option.name}</option>);
      case '3': return daysRunCommandsOptions.map(option => <option value={option.value}>{option.name}</option>);
      case '4': return weeklyRunCommandOptions.map(option => <option value={option.value}>{option.name}</option>);
      case '5': return monthlyRunCommandOptions.map(option => <option value={option.value}>{option.name}</option>);
      default: break;
    }
  }

  const selectName = () => {
    switch (state.activeTab) {
      case '1': return 'h_min';
      case '2': return 'h_hour';
      case '3': return 'h_day';
      case '4': return 'h_wday';
      case '5': return 'h_month';
      default: break;
    }
  }

  return (
    <div class="form-group run-command">
      <label htmlFor="run-command">{i18n['Run Command']}:</label>
      <select className="form-control" name={selectName()}>
        {renderOptions()}
      </select>
    </div >
  );
}

export default RunCommandSelect;