import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import './AdvancedOptions.scss';
import { useSelector } from 'react-redux';

const AdvancedOptions = props => {
  const { i18n } = useSelector(state => state.session);
  const [state, setState] = useState({
    nameServersAmount: [],
    userNS: props.userNS
  });

  useEffect(() => {
    if (props.userNS.length) {
      let initNameServersAmount = props.userNS.map((userNS, index) => index + 1);
      setState({ ...state, nameServersAmount: initNameServersAmount });
    }
  }, []);

  const renderNameServerInputs = () => {
    return state.nameServersAmount.map((nameServer, index) => {
      return (
        <div className="name-server-input-wrapper" key={index}>
          <input
            type="text"
            className="form-control"
            id={`v_ns${nameServer}`}
            defaultValue={state.userNS[index] || ''}
            name={`v_ns${nameServer}`} />
          <button
            type="button"
            className={nameServer < 3 ? 'hide' : 'show delete'}
            onClick={() => onDeleteNameServer(nameServer)}>
            {i18n.delete ?? 'Delete'}
          </button>
        </div>
      );
    });
  }

  const onDeleteNameServer = index => {
    let nameServersDuplicate = [...state.nameServersAmount];

    nameServersDuplicate.splice(index - 1, 1);

    setState({ ...state, nameServersAmount: nameServersDuplicate });
  }

  const addNameServer = () => {
    let nameServersLength = state.nameServersAmount.length;
    let nameServersDuplicate = [...state.nameServersAmount];

    nameServersDuplicate.push(nameServersLength + 1);

    setState({ ...state, nameServersAmount: nameServersDuplicate });
  }

  const addNameServerClassName = () => {
    return state.nameServersAmount.length === 8 ? 'hide' : 'show optional';
  }

  const getCurrentDatePlusYear = () => {
    let currentDatePlusYear = dayjs().add(1, 'year').format('YYYY-MM-DD');
    return currentDatePlusYear;
  }

  return (
    <div>
      <div className="form-group exp-date">
        <label htmlFor="exp_date">
          {i18n['Expiration Date'] ?? 'Expiration Date'}
          <span className="optional">({i18n['YYYY-MM-DD'] ?? 'YYYY-MM-DD'})</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="exp_date"
          required
          defaultValue={getCurrentDatePlusYear()}
          name="v_exp" />
      </div>

      <div className="form-group">
        <label htmlFor="name_servers">TTL</label>
        <input
          type="text"
          className="form-control"
          id="name_servers"
          required
          defaultValue="14400"
          name="v_ttl" />
      </div>

      <div className="form-group name-servers">
        <label htmlFor="v_ns1">{i18n['Name servers'] ?? 'Name servers'}</label>
        {renderNameServerInputs()}
      </div>

      <button
        type="button"
        className={addNameServerClassName()}
        onClick={() => addNameServer()}>
        {i18n['Add one more Name Server'] ?? 'Add one more Name Server'}
      </button>
    </div>
  );
}

export default AdvancedOptions;