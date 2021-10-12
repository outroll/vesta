import React, { useEffect, useState } from 'react';

import SecondTabSelects from './SecondTabSelects';
import ThirdTabSelects from './ThirdTabSelects';
import FourthTabSelects from './FourthTabSelects';
import FifthTabSelects from './FifthTabSelects';

import './SelectsWrapper.scss';

const OtherSelects = props => {
  const [state, setState] = useState({
    activeTab: ''
  });

  useEffect(() => {
    setState({ ...state, activeTab: props.activeTab });
  }, [props.activeTab]);

  const renderSelects = () => {
    switch (state.activeTab) {
      case '1': return (
        <div>
          <input type="hidden" name="h_hour" value="*" />
          <input type="hidden" name="h_day" value="*" />
          <input type="hidden" name="h_month" value="*" />
          <input type="hidden" name="h_wday" value="*" />
        </div>
      )
      case '2': return <SecondTabSelects />;
      case '3': return <ThirdTabSelects />;
      case '4': return <FourthTabSelects />;
      case '5': return <FifthTabSelects />;
      default: break;
    }
  }

  return (
    <div className={`tab-${state.activeTab}`}>
      {renderSelects()}
    </div>
  );
}

export default OtherSelects;
