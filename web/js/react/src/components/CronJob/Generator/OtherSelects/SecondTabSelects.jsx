import React from 'react';
import { hourlyMinutesOptions } from '../../../../ControlPanelService/GeneratorOptions';

export default function SecondTabSelects() {
  const { i18n } = window.GLOBAL.App;

  const renderOptions = () => {
    return hourlyMinutesOptions.map((option, index) => <option key={index} value={option.value}>{option.name}</option>);
  }

  return (
    <div className='second-tab-selects'>
      <input type="hidden" name="h_day" value="*" />
      <input type="hidden" name="h_month" value="*" />
      <input type="hidden" name="h_wday" value="*" />

      <div className="form-group minute">
        <label htmlFor="run-command">{i18n.Minute ?? 'Minute'}:</label>
        <select className="form-control" name="h_min">
          {renderOptions()}
        </select>
      </div>
    </div>
  );
}