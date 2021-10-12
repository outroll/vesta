import React, { useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { bulkAction, getDNSRecordsList, handleAction } from '../../ControlPanelService/Dns';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from 'src/components/ControlPanel/Modal/Modal';
import DnsRecord from 'src/components/DNSRecord/DNSRecord';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import { Link, useHistory } from 'react-router-dom';
import QueryString from 'qs';

import './DNSRecords.scss';
import { Helmet } from 'react-helmet';

export default function DnsRecords(props) {
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem('token');
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const history = useHistory();
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: '',
  });
  const [state, setState] = useState({
    dnsRecords: [],
    dnsRecordFav: [],
    domain: '',
    loading: true,
    toggledAll: false,
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
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
  }, [controlPanelFocusedElement, focusedElement, state.dnsRecords]);

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

  const initFocusedElement = dnsRecords => {
    dnsRecords[0]['FOCUSED'] = dnsRecords[0]['NAME'];
    setState({ ...state, dnsRecords });
    dispatch(addControlPanelContentFocusedElement(dnsRecords[0]['NAME']));
  }

  const handleArrowDown = () => {
    let dnsRecords = [...state.dnsRecords];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(dnsRecords);
      return;
    }

    let focusedElementPosition = dnsRecords.findIndex(dnsRecord => dnsRecord.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== dnsRecords.length - 1) {
      let nextFocusedElement = dnsRecords[focusedElementPosition + 1];
      dnsRecords[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, dnsRecords });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let dnsRecords = [...state.dnsRecords];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(dnsRecords);
      return;
    }

    let focusedElementPosition = dnsRecords.findIndex(dnsRecord => dnsRecord.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = dnsRecords[focusedElementPosition - 1];
      dnsRecords[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, dnsRecords });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      if (event.keyCode === 13) {
        return handleEdit();
      } else if (event.keyCode === 8) {
        return handleDelete();
      }
    }
  }

  const handleEdit = () => {
    props.history.push(`/edit/dns/?domain=${controlPanelFocusedElement}`);
  }

  const handleDelete = () => {
    const { databases } = state;
    let currentDatabaseData = databases.filter(database => database.NAME === controlPanelFocusedElement)[0];

    displayModal(currentDatabaseData.delete_conf, `/delete/database/?domain=${controlPanelFocusedElement}&token=${token}`);
  }

  const fetchData = () => {
    let parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });

    setState({ ...state, loading: true });

    getDNSRecordsList(parsedQueryString.domain || '')
      .then(result => {
        setState({
          ...state,
          dnsRecords: reformatData(result.data.data),
          dnsRecordFav: result.data.dnsRecordsFav,
          totalAmount: result.data.totalAmount,
          domain: parsedQueryString.domain,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let dnsRecords = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      dnsRecords.push(data[i]);
    }

    return dnsRecords;
  }

  const dnsRecords = () => {
    const { dnsRecords } = state;
    const result = [];
    const dnsRecordFav = { ...state.dnsRecordFav };

    dnsRecords.forEach(dnsRecord => {
      dnsRecord.FOCUSED = controlPanelFocusedElement === dnsRecord.NAME;

      if (dnsRecordFav[dnsRecord.NAME]) {
        dnsRecord.STARRED = dnsRecordFav[dnsRecord.NAME];
      } else {
        dnsRecord.STARRED = 0;
      }

      result.push(dnsRecord);
    });

    return result.map((item, index) => {
      return <DnsRecord data={item} key={index} domain={state.domain} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, dnsRecords } = state;
    let duplicate = [...selection];
    let dnsDuplicate = dnsRecords;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = dnsDuplicate.findIndex(dns => dns.NAME === name);
    dnsDuplicate[incomingItem].isChecked = !dnsDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, dnsRecords: dnsDuplicate, selection: duplicate });
  }

  const toggleFav = (value, type) => {
    const { dnsRecordFav } = state;
    let dnsRecFavDuplicate = dnsRecordFav;

    if (type === 'add') {
      dnsRecFavDuplicate[value] = 1;

      addFavorite(value, 'dns_rec')
        .then(() => {
          setState({ ...state, dnsRecordFav: dnsRecFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      dnsRecFavDuplicate[value] = undefined;

      deleteFavorite(value, 'dns_rec')
        .then(() => {
          setState({ ...state, dnsRecordFav: dnsRecFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const dnsRecordsDuplicate = [...state.dnsRecords];

    if (toggled) {
      let dnsRecordNames = []

      let dnsRecords = dnsRecordsDuplicate.map(dnsRecord => {
        dnsRecordNames.push(dnsRecord.NAME);
        dnsRecord.isChecked = true;
        return dnsRecord;
      });

      setState({ ...state, dnsRecords, selection: dnsRecordNames, toggledAll: toggled });
    } else {
      let dnsRecords = dnsRecordsDuplicate.map(dnsRecord => {
        dnsRecord.isChecked = false;
        return dnsRecord;
      });

      setState({ ...state, dnsRecords, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;

    if (selection.length && action) {
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

  const displayModal = (text, url) => {
    setModal({
      ...modal,
      visible: true,
      text: text,
      actionUrl: url
    });
  }

  const modalConfirmHandler = () => {
    handleAction(modal.actionUrl)
      .then(() => {
        fetchData();
        modalCancelHandler();
      })
      .catch(err => console.error(err));
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
    <div className="dns-records">
      <Helmet>
        <title>{`Vesta - ${i18n.DNS}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name={i18n['Add DNS Record']} href={`/add/dns/?domain=${state.domain}`} showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='dnsList' bulkAction={bulk} />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      {state.loading
        ? <Spinner />
        : (
          <>
            <div className="dns-records-wrapper">
              <div className="subtitle">
                <span>{`${i18n['Listing']}  ${state.domain}`}</span>
              </div>
              {dnsRecords()}
            </div>
            <div className="footer-actions-wrapper">
              <div className="total">{state.totalAmount}</div>
              <div className="back">
                <Link to="/list/dns/">{i18n['Back']}</Link>
              </div>
            </div>
          </>
        )
      }
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}