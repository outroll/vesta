import React, { useEffect, useState } from 'react';

const NameServers = props => {
  const { i18n } = window.GLOBAL.App;
  const [state, setState] = useState({
    nameServersAmount: [],
    usersNS: []
  });

  useEffect(() => {
    if (props.usersNS) {
      let initNameServersAmount = props.usersNS.map((userNS, index) => index + 1);
      setState({ ...state, usersNS: props.usersNS, nameServersAmount: initNameServersAmount });
    }
  }, [props.usersNS]);

  const renderNameServerInputs = () => {
    return state.nameServersAmount.map((nameServer, index) => {
      if (nameServer < 9) {
        return (
          <div className="name-server-input-wrapper" key={index}>
            <input
              type="text"
              className="form-control"
              id={`v_ns${index + 1}`}
              defaultValue={state.usersNS[index] || ''}
              name={`v_ns${index + 1}`} />
            <button
              type="button"
              className={index < 2 ? 'hide' : 'show delete'}
              onClick={() => onDeleteNameServer(index)}>
              {i18n.delete ?? 'Delete'}
            </button>
          </div>
        );
      }
    });
  }

  const addNameServerClassName = () => {
    return state.nameServersAmount.length === 8 ? 'hide' : 'show optional';
  }

  const addNameServer = () => {
    let nameServersLength = state.nameServersAmount.length;
    let nameServersDuplicate = [...state.nameServersAmount];

    nameServersDuplicate.push(nameServersLength + 1);

    setState({ ...state, nameServersAmount: nameServersDuplicate });
  }

  const onDeleteNameServer = index => {
    let nameServersDuplicate = [...state.nameServersAmount];

    nameServersDuplicate.splice(index - 1, 1);

    setState({ ...state, nameServersAmount: nameServersDuplicate });
  }

  return (
    <>
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
    </>
  );
}

export default NameServers;