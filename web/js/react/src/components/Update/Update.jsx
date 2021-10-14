import React, { } from 'react';
import Container from '../ControlPanel/Container/Container';
import ListItem from '../ControlPanel/ListItem/ListItem';
import './Update.scss';

const Update = props => {
  const { data } = props;
  const { i18n } = window.GLOBAL.App;

  const isUpdated = status => {
    if (status === 'no') {
      return 'OUTDATED';
    }

    return 'UPDATED';
  }

  const isOutdated = status => {
    return status === "no";
  }

  const checkItem = () => {
    props.checkItem(props.data.NAME);
  }

  return (
    <ListItem
      date={false}
      id={data.NAME}
      checkItem={checkItem}
      focused={data.FOCUSED}
      checked={data.isChecked}
      outdated={isOutdated(data.UPDATED)}
      leftNameText={isUpdated(data.UPDATED)}>

      <Container className="r-col w-85">
        <div className="name">{data.NAME}</div>
        <div className="stats">
          <Container className="c-1">
            <div className="descr"><span className="stat">{data.DESCR}</span></div>
          </Container>
          <Container className="c-2">
            <div>{i18n.Version}: <span><span className="stat">{data.VERSION}</span> {`(${data.ARCH})`}</span></div>
          </Container>
          <Container className="c-3">
            <div>{i18n.Release}: <span className="stat">{data.RELEASE}</span></div>
          </Container>
        </div>
      </Container>

    </ListItem>
  );
}

export default Update;