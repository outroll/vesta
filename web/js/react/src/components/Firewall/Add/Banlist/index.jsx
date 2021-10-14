import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "src/actions/MainNavigation/mainNavigationActions";
import AddItemLayout from 'src/components/ControlPanel/AddItemLayout/AddItemLayout';
import { getBanIps, addBanIp } from 'src/ControlPanelService/Firewalls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'src/components/Spinner/Spinner';
import Toolbar from '../../../MainNav/Toolbar/Toolbar';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';

const AddBanIP = () => {
  const { i18n } = window.GLOBAL.App;
  const userLanguage = localStorage.getItem("language");
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    banIps: [],
    errorMessage: '',
    okMessage: '',
    loading: false
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/firewall/'));
    dispatch(removeFocusedElement());

    setState({ ...state, loading: true });

    getBanIps()
      .then(result => {
        setState({ ...state, ip: result.data.ip, chain: result.data.chain, loading: false });
      });
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let newUser = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newUser[name] = value;
    }

    if (Object.keys(newUser).length !== 0 && newUser.constructor === Object) {
      addBanIp(newUser)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '' });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg });
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  const renderChainOptions = () => {
    return ['SSH', 'WEB', 'FTP', 'DNS', 'MAIL', 'DB', 'VESTA'].map((chain, index) => (
      <option key={index} selected={userLanguage === chain} value={chain}>{chain}</option>
    ));
  }

  return (
    <div className="edit-template add-user">
      <Helmet>
        <title>{`Vesta - ${i18n.FIREWALL}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding IP Address to Banlist']}</div>
        <div className="error"><span className="error-message">{state.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}</span></div>
        <div className="success">
          <span className="ok-message">{state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span> </span>
        </div>
      </Toolbar>
      <AddItemLayout>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="add-user">
            <div class="form-group">
              <label htmlFor="chain">{i18n.Banlist}</label>
              <select class="form-control" id="chain" name="v_chain">
                {renderChainOptions()}
              </select>
            </div>

            <div className="form-group exp-date">
              <label htmlFor="ip">
                {i18n['IP address']}
                <span className="optional">({i18n['CIDR format is supported']})</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="ip"
                required
                name="v_ip" />
            </div>

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add}</button>
              <button type="button" className="back" onClick={() => history.push('/list/firewall/banlist')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default AddBanIP;
