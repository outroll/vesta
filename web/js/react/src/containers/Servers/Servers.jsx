import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import { bulkAction, getServersList, handleAction } from '../../ControlPanelService/Server';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import ServerSys from '../../components/Server/ServerSys';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import Server from '../../components/Server/Server';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './Servers.scss';

const Servers = props => {
  const { i18n } = window.GLOBAL.App;
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: '',
  });
  const [state, setState] = useState({
    servers: [],
    selection: [],
    loading: false,
    toggledAll: false,
    sorting: i18n.Action,
    order: "descending",
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/server/'));
    dispatch(removeFocusedElement());
    dispatch(removeControlPanelContentFocusedElement());
    fetchData();

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
  }, [controlPanelFocusedElement, focusedElement, state.servers]);

  const handleContentSelection = event => {
    if (event.keyCode === 38 || event.keyCode === 40) {
      if (focusedElement) {
        dispatch(removeFocusedElement());
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

  const initFocusedElement = servers => {
    servers[0]['FOCUSED'] = servers[0]['NAME'];
    setState({ ...state, servers });
    dispatch(addControlPanelContentFocusedElement(servers[0]));
  }

  const handleArrowDown = () => {
    let servers = [...state.servers];

    if (focusedElement) {
      removeFocusedElement();
    }

    if (controlPanelFocusedElement.NAME === '' || controlPanelFocusedElement === '') {
      initFocusedElement(servers);
      return;
    }

    let focusedElementPosition = servers.findIndex(server => server.NAME === controlPanelFocusedElement.NAME);

    if (focusedElementPosition !== servers.length - 1) {
      let nextFocusedElement = servers[focusedElementPosition + 1];
      servers[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, servers });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement));
    }
  }

  const handleArrowUp = () => {
    let servers = [...state.servers];

    if (focusedElement) {
      removeFocusedElement();
    }

    if (controlPanelFocusedElement.NAME === '' || controlPanelFocusedElement === '') {
      initFocusedElement(servers);
      return;
    }

    let focusedElementPosition = servers.findIndex(server => server.NAME === controlPanelFocusedElement.NAME);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = servers[focusedElementPosition - 1];
      servers[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, servers });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement.NAME && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 13: return handleConfigure();
        case 82: return handleRestart();
        case 83: return handleStop();
        default: break;
      }
    }
  }

  const handleConfigure = () => {
    if (controlPanelFocusedElement.NAME !== state.servers[0].NAME) {
      props.history.push(`/edit/server/${controlPanelFocusedElement.NAME}`);
    } else {
      props.history.push('/edit/server/');
    }
  }

  const handleStop = () => {
    onHandleAction(controlPanelFocusedElement.action_url);
  }

  const handleRestart = () => {
    onHandleAction(`/api/restart/service/?srv=${controlPanelFocusedElement.NAME}`);
  }

  const fetchData = () => {
    setState({ ...state, loading: true });

    getServersList()
      .then(result => {
        setState({
          ...state,
          servers: reformatData(result.data.data, result.data.sys),
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = (servers, sysInfo) => {
    let result = [];

    for (let i in servers) {
      servers[i]['NAME'] = i;
      servers[i]['FOCUSED'] = controlPanelFocusedElement.NAME === i;

      result.push(servers[i]);
    }

    result.splice(0, 0, Object.values(sysInfo)[0]);
    result[0]['NAME'] = result[0]['HOSTNAME'];

    return result;
  }

  const servers = () => {
    const result = [];

    state.servers.forEach(server => {
      server.FOCUSED = controlPanelFocusedElement.NAME === server.NAME;
      result.push(server);
    });

    return result.map((item, index) => {
      if (item.HOSTNAME) {
        return <ServerSys data={item} key={index} checkItem={checkItem} handleAction={onHandleAction} />
      } else {
        return <Server data={item} key={index} checkItem={checkItem} handleAction={onHandleAction} />
      }
    });
  }

  const onHandleAction = uri => {
    dispatch(removeControlPanelContentFocusedElement());
    if (uri) {
      setState({ ...state, loading: true });

      handleAction(uri)
        .then(res => {
          if (res.data.error) {
            displayModal(res.data.error);
          }

          setState({ ...state, loading: false });
        })
        .catch(err => {
          setState({ ...state, loading: false });
          console.error(err)
        });
    }
  }

  const toggleAll = toggled => {
    let serversDuplicate = [...state.servers];

    if (toggled) {
      let serverNames = [];

      let servers = serversDuplicate.map(server => {
        serverNames.push(server.NAME);
        server.isChecked = true;
        return server;
      });

      setState({ ...state, servers, selection: serverNames, toggledAll: toggled });
    } else {
      let servers = serversDuplicate.map(server => {
        server.isChecked = false;
        return server;
      });

      setState({ ...state, servers, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;

    if (selection.length && action) {
      setState({ ...state, loading: true });
      bulkAction(action, selection)
        .then(res => {
          if (res.data.error) {
            displayModal(res.data.error);
          }

          fetchData();
          toggleAll(false);
        })
        .catch(err => console.error(err));
    }
  }

  const checkItem = name => {
    const { selection } = state;
    let duplicate = [...selection];
    let serversDuplicate = [...state.servers];
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = serversDuplicate.findIndex(server => server.NAME === name);
    serversDuplicate[incomingItem].isChecked = !serversDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, servers: serversDuplicate, selection: duplicate });
  }

  const displayModal = text => {
    setModal({ ...modal, visible: true, text });
  }

  const modalConfirmHandler = () => {
    modalCancelHandler();
    setState({ ...state, loading: true });
    handleAction(modal.actionUrl)
      .then(() => fetchData())
      .catch(err => console.error(err));
  }

  const modalCancelHandler = () => {
    setModal({ ...modal, visible: false, text: '' });
  }

  return (
    <div className="servers-list">
      <Helmet>
        <title>{`Vesta - ${i18n.SERVER}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <LeftButton href="/edit/server/" list="server" name={i18n.configure} showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Link to="/list/server/cpu" className="button-extra">{i18n['show: CPU / MEM / NET / DISK']}</Link>
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='serverList' bulkAction={bulk} />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      {state.loading ? <Spinner /> : (
        <div className="servers-wrapper">
          {servers()}
        </div>
      )}

      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        showSaveButton={false}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default Servers;
