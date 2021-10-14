import React from 'react';
import './Container.scss';

const Container = props => {
  return(
    <div className={props.className}>
      {props.children}
    </div>
  );
}

export default Container;