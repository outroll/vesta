import React from 'react';
import { useSelector } from 'react-redux';
import { generatorOptions } from '../../../../ControlPanelService/GeneratorOptions';

export default function ThirdTabSelects() {
  const { i18n } = useSelector(state => state.session);
  const { dailyMinutesOptions, hoursOptions } = generatorOptions(i18n);

  const renderHours = () => {
    return hoursOptions.map((option, index) => <option key={index} value={option.value}>{option.name}</option>);
  }

  const renderOptions = () => {
    return dailyMinutesOptions.map((option, index) => <option key={index} value={option.value}>{option.name}</option>);
  }

  return (
    <div className='third-tab-selects'>
      <input type="hidden" name="h_month" value="*" />
      <input type="hidden" name="h_wday" value="*" />

      <div className="form-group hour">
        <label htmlFor="run-command">{i18n.Hour ?? 'Hour'}:</label>
        <select className="form-control" name="h_hour">
          {renderHours()}
        </select>
      </div>

      <div className="form-group minute">
        <label htmlFor="run-command">{i18n.Minute ?? 'Minute'}:</label>
        <select className="form-control" name="h_min">
          {renderOptions()}
        </select>
      </div>
    </div>
  );
}