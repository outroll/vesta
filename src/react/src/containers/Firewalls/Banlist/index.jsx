import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from 'src/actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from 'src/actions/MainNavigation/mainNavigationActions';
import { bulkAction, getBanList, handleAction } from 'src/ControlPanelService/Firewalls';
import * as MainNavigation from 'src/actions/MainNavigation/mainNavigationActions';
import SearchInput from 'src/components/MainNav/Toolbar/SearchInput/SearchInput';
import LeftButton from 'src/components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from 'src/components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from 'src/components/MainNav/Toolbar/Select/Select';
import Toolbar from 'src/components/MainNav/Toolbar/Toolbar';
import Modal from 'src/components/ControlPanel/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'src/components/Spinner/Spinner';
import Ban from 'src/components/Firewall/Ban';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router';

import './styles.scss';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';

const BanLists = props => {
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: ''
  });
  const [state, setState] = useState({
    banIps: [],
    selection: [],
    toggledAll: false,
    sorting: i18n.Action,
    order: "descending",
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/firewall/'));
    dispatch(removeFocusedElement());
    dispatch(removeControlPanelContentFocusedElement());
    fetchData().then(() => setLoading(false));

    return () => {
      dispatch(removeControlPanelContentFocusedElement());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleContentSelection);
    window.addEventListener("keydown", handleFocusedElementShortcuts);

    return () => {
      window.removeEventListener("keydown", handleContentSelection);
      window.removeEventListener("keydown", handleFocusedElementShortcuts);
    };
  }, [controlPanelFocusedElement, focusedElement, state.banIps]);

  const handleContentSelection = event => {
    if (event.keyCode === 38 || event.keyCode === 40) {
      if (focusedElement) {
        dispatch(MainNavigation.removeFocusedElement());
      }
    }

    if (event.keyCode === 38) {
      event.preventDefault();
      handleArrowUp();
    } else if (event.keyCode === 40) {
      event.preventDefault();
      handleArrowDown();
    }
  }

  const initFocusedElement = banIps => {
    banIps[0]['FOCUSED'] = banIps[0]['NAME'];
    setState({ ...state, banIps });
    dispatch(addControlPanelContentFocusedElement(banIps[0]['NAME']));
  }

  const handleArrowDown = () => {
    let banIps = [...state.banIps];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement.NAME === '') {
      initFocusedElement(banIps);
      return;
    }

    let focusedElementPosition = banIps.findIndex(banIp => banIp.NAME === controlPanelFocusedElement.NAME);

    if (focusedElementPosition !== banIps.length - 1) {
      let nextFocusedElement = banIps[focusedElementPosition + 1];
      banIps[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, banIps });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let banIps = [...state.banIps];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement.NAME === '') {
      initFocusedElement(banIps);
      return;
    }

    let focusedElementPosition = banIps.findIndex(banIp => banIp.NAME === controlPanelFocusedElement.NAME);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = banIps[focusedElementPosition - 1];
      banIps[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, banIps });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 8: return handleDelete();
        default: break;
      }
    }
  }

  const handleDelete = () => {
    const { banIps } = state;
    let currentBanIpData = banIps.filter(banIp => banIp.NAME === controlPanelFocusedElement.NAME)[0];

    displayModal(currentBanIpData.delete_conf, controlPanelFocusedElement.delete_url);
  }

  const fetchData = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      getBanList()
        .then(result => {
          setState({
            ...state,
            banIps: reformatData(result.data.data),
            totalAmount: result.data.total_amount,
            toggledAll: false,
            selection: []
          });
          resolve();
        })
        .catch(err => console.error(err));
    });
  }

  const reformatData = data => {
    let banIps = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement.NAME === i;
      banIps.push(data[i]);
    }

    return banIps;
  }

  const banIps = () => {
    let banIps = [...state.banIps];

    banIps.forEach(banIp => {
      banIp.FOCUSED = controlPanelFocusedElement.NAME === banIp.NAME;
    });

    return banIps.map((item, index) => {
      return <Ban data={item} key={index} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, banIps } = state;
    let duplicate = [...selection];
    let banIpsDuplicate = banIps;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = banIpsDuplicate.findIndex(banIp => banIp.NAME === name);
    banIpsDuplicate[incomingItem].isChecked = !banIpsDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, banIps: banIpsDuplicate, selection: duplicate });
  }

  const toggleAll = toggled => {
    if (toggled) {
      let banIpNames = [];

      let banIps = state.banIps.map(banIp => {
        banIpNames.push(banIp.NAME);
        banIp.isChecked = true;
        return banIp;
      });

      setState({ ...state, banIps, selection: banIpNames, toggledAll: toggled });
    } else {
      let banIps = state.banIps.map(banIp => {
        banIp.isChecked = false;
        return banIp;
      });

      setState({ ...state, banIps, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;

    if (selection.length && action) {
      bulkAction(action, selection, state.banIps)
        .then(result => {
          if (result.status === 200) {
            toggleAll(false);
            fetchData();
          }
        })
        .catch(err => console.error(err));
    }
  }

  const displayModal = (text, actionUrl) => {
    setModal({ ...modal, visible: !modal.visible, text, actionUrl });
  }

  const modalConfirmHandler = () => {
    if (!modal.actionUrl) {
      return modalCancelHandler();
    }

    modalCancelHandler();
    setLoading(true);
    handleAction(modal.actionUrl)
      .then(res => {
        if (res.data.error) {
          setLoading(false);
          return displayModal(res.data.error, '');
        }
        fetchData();
      })
      .catch(err => { setLoading(false); console.error(err); });
  }

  const modalCancelHandler = () => {
    setModal({ ...modal, visible: !modal.visible, text: '', actionUrl: '' });
  }

  return (
    <div className="firewalls">
      <Helmet>
        <title>{`Vesta - ${i18n.FIREWALL}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton href="/add/firewall/banlist" name={i18n['Ban IP Address']} showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='banList' bulkAction={bulk} />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      {loading
        ? <Spinner />
        : (<>
          <div className="banlist-wrapper">
            {banIps()}
            <div className="buttons-wrapper">
              <div className="total">{state.totalAmount}</div>
              <button type="button" className="back" onClick={() => history.push('/list/firewall/')}>{i18n.Back}</button>
            </div>
          </div>
        </>)
      }
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default BanLists;
