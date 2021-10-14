import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import { bulkAction, getIpList, handleAction } from '../../ControlPanelService/Ip';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import InternetProtocol from '../../components/InternetProtocol/InternetProtocol';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import './InternetProtocols.scss';
import { Helmet } from 'react-helmet';

const InternetProtocols = props => {
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: ''
  });
  const [state, setState] = useState({
    internetProtocols: [],
    ipFav: [],
    loading: false,
    toggledAll: false,
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/ip/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.internetProtocols]);

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

  const initFocusedElement = internetProtocols => {
    internetProtocols[0]['FOCUSED'] = internetProtocols[0]['NAME'];
    setState({ ...state, internetProtocols });
    dispatch(addControlPanelContentFocusedElement(internetProtocols[0]['NAME']));
  }

  const handleArrowDown = () => {
    let internetProtocols = [...state.internetProtocols];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(internetProtocols);
      return;
    }

    let focusedElementPosition = internetProtocols.findIndex(pack => pack.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== internetProtocols.length - 1) {
      let nextFocusedElement = internetProtocols[focusedElementPosition + 1];
      internetProtocols[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, internetProtocols });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let internetProtocols = [...state.internetProtocols];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(internetProtocols);
      return;
    }

    let focusedElementPosition = internetProtocols.findIndex(pack => pack.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = internetProtocols[focusedElementPosition - 1];
      internetProtocols[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, internetProtocols });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 8: return handleDelete();
        case 13: return handleEdit();
        default: break;
      }
    }
  }

  const handleEdit = () => {
    props.history.push(`/edit/ip/?ip=${controlPanelFocusedElement}`);
  }

  const handleDelete = () => {
    const { internetProtocols } = state;
    let currentInternetProtocolData = internetProtocols.filter(pack => pack.NAME === controlPanelFocusedElement)[0];

    displayModal(currentInternetProtocolData.delete_conf, `/delete/ip/?ip=${controlPanelFocusedElement}&token=${token}`);
  }

  const fetchData = () => {
    setState({ ...state, loading: true });

    getIpList()
      .then(result => {
        setState({
          ...state,
          internetProtocols: reformatData(result.data.data),
          ipFav: result.data.ipFav,
          selection: [],
          totalAmount: result.data.totalAmount,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let internetProtocols = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      internetProtocols.push(data[i]);
    }

    return internetProtocols;
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const internetProtocols = () => {
    const { internetProtocols } = state;
    const ipFav = { ...state.ipFav };
    const result = [];

    internetProtocols.forEach(internetProtocol => {
      internetProtocol.FOCUSED = controlPanelFocusedElement === internetProtocol.NAME;

      if (ipFav[internetProtocol.NAME]) {
        internetProtocol.STARRED = ipFav[internetProtocol.NAME];
      } else {
        internetProtocol.STARRED = 0;
      }

      result.push(internetProtocol);
    });

    let sortedResult = sortArray(result);

    return sortedResult.map((item, index) => {
      return <InternetProtocol data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, internetProtocols } = state;
    let duplicate = [...selection];
    let internetProtocolsDuplicate = internetProtocols;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = internetProtocolsDuplicate.findIndex(ip => ip.NAME === name);
    internetProtocolsDuplicate[incomingItem].isChecked = !internetProtocolsDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, internetProtocols: internetProtocolsDuplicate, selection: duplicate });
  }

  const sortArray = array => {
    const { order, sorting } = state;
    let sortingColumn = sortBy(sorting);

    if (order === "descending") {
      return array.sort((a, b) => (a[sortingColumn] < b[sortingColumn]) ? 1 : ((b[sortingColumn] < a[sortingColumn]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[sortingColumn] > b[sortingColumn]) ? 1 : ((b[sortingColumn] > a[sortingColumn]) ? -1 : 0));
    }
  }

  const sortBy = sorting => {
    const { Date, IP, Domains, Netmask, Interface, Owner, Starred } = i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case IP: return 'IP';
      case Netmask: return 'NETMASK';
      case Interface: return 'INTERFACE';
      case Domains: return 'U_WEB_DOMAINS';
      case Owner: return 'OWNER';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    const { ipFav } = state;
    let ipFavDuplicate = ipFav;

    if (type === 'add') {
      ipFavDuplicate[value] = 1;

      addFavorite(value, 'ip')
        .then(() => {
          setState({ ...state, ipFav: ipFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      ipFavDuplicate[value] = undefined;

      deleteFavorite(value, 'ip')
        .then(() => {
          setState({ ...state, ipFav: ipFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    let internetProtocolsDuplicate = [...state.internetProtocols];

    if (toggled) {
      let ipNames = [];

      let internetProtocols = internetProtocolsDuplicate.map(internetProtocol => {
        ipNames.push(internetProtocol.NAME);
        internetProtocol.isChecked = true;
        return internetProtocol;
      });

      setState({ ...state, internetProtocols, selection: ipNames, toggledAll: toggled });
    } else {
      let internetProtocols = internetProtocolsDuplicate.map(internetProtocol => {
        internetProtocol.isChecked = false;
        return internetProtocol;
      });

      setState({ ...state, internetProtocols, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;

    if (selection.length && action) {
      setState({ ...state, loading: true });

      bulkAction(action, selection)
        .then(result => {
          if (result.status === 200) {
            fetchData();
            toggleAll(false);
          }
        })
        .catch(err => console.error(err));
    }
  }

  const displayModal = (text, actionUrl) => {
    setModal({ ...modal, visible: true, text, actionUrl });
  }

  const modalConfirmHandler = () => {
    modalCancelHandler();
    setState({ ...state, loading: true });

    handleAction(modal.actionUrl)
      .then(() => fetchData())
      .catch(err => console.error(err));
  }

  const modalCancelHandler = () => {
    setModal({ ...modal, visible: false, text: '', actionUrl: '' });
  }

  return (
    <div className="internetProtocols">
      <Helmet>
        <title>{`Vesta - ${i18n.IP}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name={i18n['Add IP']} href="/add/ip/" showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='internetProtocolsList' bulkAction={bulk} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="internetProtocolsList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="ip-wrapper">
        {state.loading ? <Spinner /> : internetProtocols()}
      </div>
      <div className="total">{state.totalAmount}</div>
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default InternetProtocols;
