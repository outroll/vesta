import React from 'react';
import { dailyMinutesOptions, hoursOptions, dateOptions } from '../../../../ControlPanelService/GeneratorOptions';

export default function FifthTabSelects() {
  const { i18n } = window.GLOBAL.App;

  const renderDate = () => {
    return dateOptions.map((option, index) => <option key={index} value={option.value}>{option.name}</option>);
  }

  const renderHours = () => {
    return hoursOptions.map((option, index) => <option key={index} value={option.value}>{option.name}</option>);
  }

  const renderMinutes = () => {
    return dailyMinutesOptions.map((option, index) => <option key={index} value={option.value}>{option.name}</option>);
  }

  return (
    <div className='fifth-tab-selects'>
      <input type="hidden" name="h_wday" value="*" />

      <div className="form-group date">
        <label htmlFor="run-command">{i18n.Date ?? 'Date'}:</label>
        <select className="form-control" name="h_day">
          {renderDate()}
        </select>
      </div>

      <div className="form-group hour">
        <label htmlFor="run-command">{i18n.Hour ?? 'Hour'}:</label>
        <select className="form-control" name="h_hour">
          {renderHours()}
        </select>
      </div>

      <div className="form-group minute">
        <label htmlFor="run-command">{i18n.Minute ?? 'Minute'}:</label>
        <select className="form-control" name="h_min">
          {renderMinutes()}
        </select>
      </div>
    </div>
  );
}