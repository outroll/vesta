import React from 'react';
import { useSelector } from 'react-redux';
import Container from '../../ControlPanel/Container/Container';

import './style.scss';

const Exclusion = ({ data, focused }) => {
  const { i18n } = useSelector(state => state.session);

  const renderExclusionItems = () => {
    if (!Array.isArray(data.ITEMS)) {
      for (let item in data.ITEMS) {
        return <><b>{item}</b> &nbsp; {data.ITEMS[item]}<br /></>;
      }
    } else {
      return i18n['no exclusions'];
    }
  }

  return (
    <div className={focused ? 'statistic-item focused' : 'statistic-item'} id={data.NAME}>
      <Container className="l-col w-15" />
      <Container className="r-col w-85">
        <div className="stats">
          <div className="name">{data.NAME}</div>
          <div className="exclusion-items">{renderExclusionItems()}</div>
        </div>
      </Container>
    </div>
  );
}

export default Exclusion;
