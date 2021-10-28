import React, { useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { bulkDomainAction, getDnsList, handleAction } from '../../ControlPanelService/Dns';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import DomainNameSystem from '../../components/DomainNameSystem/DomainNameSystem';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import './DomainNameSystems.scss';

import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';

const DomainNameSystems = props => {
  const { i18n } = useSelector(state => state.session);
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
    domainNameSystems: [],
    dnsFav: [],
    toggledAll: false,
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: '',
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/dns/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.domainNameSystems]);

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

  const initFocusedElement = domainNameSystems => {
    domainNameSystems[0]['FOCUSED'] = domainNameSystems[0]['NAME'];
    setState({ ...state, domainNameSystems });
    dispatch(addControlPanelContentFocusedElement(domainNameSystems[0]['NAME']));
  }

  const handleArrowDown = () => {
    let domainNameSystems = [...state.domainNameSystems];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(domainNameSystems);
      return;
    }

    let focusedElementPosition = domainNameSystems.findIndex(domainNameSystem => domainNameSystem.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== domainNameSystems.length - 1) {
      let nextFocusedElement = domainNameSystems[focusedElementPosition + 1];
      domainNameSystems[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, domainNameSystems });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let domainNameSystems = [...state.domainNameSystems];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(domainNameSystems);
      return;
    }

    let focusedElementPosition = domainNameSystems.findIndex(domainNameSystem => domainNameSystem.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = domainNameSystems[focusedElementPosition - 1];
      domainNameSystems[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, domainNameSystems });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 8: return handleDelete();
        case 13: return handleEdit();
        case 76: return handleLogs();
        case 78: return handleAddRecord();
        case 83: return handleSuspend();
        default: break;
      }
    }
  }

  const handleAddRecord = () => {
    props.history.push(`/add/dns/?domain=${controlPanelFocusedElement}`);
  }

  const handleLogs = () => {
    props.history.push(`/list/dns?domain=${controlPanelFocusedElement}&type=access`);
  }

  const handleEdit = () => {
    props.history.push(`/edit/dns?domain=${controlPanelFocusedElement}`);
  }

  const handleSuspend = () => {
    const { domainNameSystems } = state;
    let currentDomainNameSystemData = domainNameSystems.filter(domainNameSystem => domainNameSystem.NAME === controlPanelFocusedElement)[0];
    let suspendedStatus = currentDomainNameSystemData.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';

    displayModal(currentDomainNameSystemData.suspend_conf, `/api/v1/${suspendedStatus}/dns/index.php?domain=${controlPanelFocusedElement}`);
  }

  const handleDelete = () => {
    const { domainNameSystems } = state;
    let currentDomainNameSystemData = domainNameSystems.filter(domainNameSystem => domainNameSystem.NAME === controlPanelFocusedElement)[0];

    displayModal(currentDomainNameSystemData.delete_conf, `/api/v1/delete/dns/index.php?domain=${controlPanelFocusedElement}`);
  }

  const fetchData = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      getDnsList()
        .then(result => {
          setState({
            ...state,
            domainNameSystems: reformatData(result.data.data),
            dnsFav: result.data.dnsFav,
            selection: [],
            toggledAll: false,
            totalAmount: result.data.totalAmount
          });
          resolve();
        })
        .catch(err => console.error(err));
    });
  }

  const reformatData = data => {
    let domainNameSystems = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['RECORDS'] = Number(data[i]['RECORDS']);
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      domainNameSystems.push(data[i]);
    }

    return domainNameSystems;
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const dns = () => {
    const { domainNameSystems } = state;
    const dnsFav = { ...state.dnsFav };
    const result = [];

    domainNameSystems.forEach(domainNameSystem => {
      domainNameSystem.FOCUSED = controlPanelFocusedElement === domainNameSystem.NAME;

      if (dnsFav[domainNameSystem.NAME]) {
        domainNameSystem.STARRED = dnsFav[domainNameSystem.NAME];
      } else {
        domainNameSystem.STARRED = 0;
      }

      result.push(domainNameSystem);
    });

    let sortedResult = sortArray(result);

    return sortedResult.map((item, index) => {
      return <DomainNameSystem data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, domainNameSystems } = state;
    let duplicate = [...selection];
    let domainNameSystemsDuplicate = domainNameSystems;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = domainNameSystemsDuplicate.findIndex(domainNameSystem => domainNameSystem.NAME === name);
    domainNameSystemsDuplicate[incomingItem].isChecked = !domainNameSystemsDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, domainNameSystems: domainNameSystemsDuplicate, selection: duplicate });
  }

  const sortArray = array => {
    const { order, sorting } = state;
    let sortingColumn = sortBy(sorting);

    if (order === "descending") {
      return array.sort((a, b) => {
        const first = a[sortingColumn];
        const second = b[sortingColumn];
        return (first < second) ? 1 : ((second < first) ? -1 : 0);
      });
    } else {
      return array.sort((a, b) => {
        const first = a[sortingColumn];
        const second = b[sortingColumn];
        return (first > second) ? 1 : ((second > first) ? -1 : 0)
      });
    }
  }

  const sortBy = sorting => {
    const { Date, Expire, Domain, IP, Records, Starred } = i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case Expire: return 'EXP';
      case Domain: return 'NAME';
      case IP: return 'IP';
      case Records: return 'RECORDS';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    const { dnsFav } = state;
    let dnsFavDuplicate = dnsFav;

    if (type === 'add') {
      dnsFavDuplicate[value] = 1;

      addFavorite(value, 'dns')
        .then(() => {
          setState({ ...state, dnsFav: dnsFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      dnsFavDuplicate[value] = undefined;

      deleteFavorite(value, 'dns')
        .then(() => {
          setState({ ...state, dnsFav: dnsFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const domainNameSystemsDuplicate = [...state.domainNameSystems];

    if (toggled) {
      let domainNameSystemsNames = [];

      let domainNameSystems = domainNameSystemsDuplicate.map(domainNameSystem => {
        domainNameSystemsNames.push(domainNameSystem.NAME);
        domainNameSystem.isChecked = true;
        return domainNameSystem;
      });

      setState({ ...state, domainNameSystems, selection: domainNameSystemsNames, toggledAll: toggled });
    } else {
      let domainNameSystems = domainNameSystemsDuplicate.map(domainNameSystem => {
        domainNameSystem.isChecked = false;
        return domainNameSystem;
      });

      setState({ ...state, domainNameSystems, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;

    if (selection.length && action) {
      setLoading(true);
      bulkDomainAction(action, selection)
        .then(result => {
          if (result.status === 200) {
            toggleAll(false);
            fetchData().then(() => refreshMenuCounters());
          }
        })
        .catch(err => console.error(err));
    }
  }

  const displayModal = (text, url) => {
    setModal({
      ...modal,
      visible: true,
      text: text,
      actionUrl: url
    });
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
        fetchData().then(() => refreshMenuCounters())
      })
      .catch(err => { setLoading(false); console.error(err); });
  }

  const refreshMenuCounters = () => {
    dispatch(refreshCounters()).then(() => setLoading(false));
  }

  const modalCancelHandler = () => {
    setModal({
      ...modal,
      visible: false,
      text: '',
      actionUrl: ''
    });
  }

  return (
    <div className="dns">
      <Helmet>
        <title>{`Vesta - ${i18n.DNS}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name={i18n['Add DNS Domain']} href="/add/dns" showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='dnsList' bulkAction={bulk} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="dnsList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="dns-wrapper">
        {loading ? <Spinner /> : dns()}
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

export default DomainNameSystems;