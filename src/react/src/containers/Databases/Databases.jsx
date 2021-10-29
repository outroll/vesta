import React, { useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { bulkAction, getDatabaseList, handleAction } from '../../ControlPanelService/Db';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Database from '../../components/Database/Database';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import './Databases.scss';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';

const Databases = props => {
  const { i18n } = useSelector(state => state.session);
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: '',
  });
  const [state, setState] = useState({
    databases: [],
    dbFav: [],
    toggledAll: false,
    dbAdmin: '',
    dbAdminLink: '',
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/db/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.databases]);

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

  const initFocusedElement = databases => {
    databases[0]['FOCUSED'] = databases[0]['NAME'];
    setState({ ...state, databases });
    dispatch(addControlPanelContentFocusedElement(databases[0]['NAME']));
  }

  const handleArrowDown = () => {
    let databases = [...state.databases];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(databases);
      return;
    }

    let focusedElementPosition = databases.findIndex(database => database.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== databases.length - 1) {
      let nextFocusedElement = databases[focusedElementPosition + 1];
      databases[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, databases });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let databases = [...state.databases];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(databases);
      return;
    }

    let focusedElementPosition = databases.findIndex(database => database.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = databases[focusedElementPosition - 1];
      databases[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, databases });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 8: return handleDelete();
        case 13: return handleEdit();
        case 83: return handleSuspend();
        default: break;
      }
    }
  }

  const handleEdit = () => {
    props.history.push(`/edit/database?domain=${controlPanelFocusedElement}`);
  }

  const handleSuspend = () => {
    const { databases } = state;
    let currentDatabaseData = databases.filter(database => database.NAME === controlPanelFocusedElement)[0];
    let suspendedStatus = currentDatabaseData.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';

    displayModal(currentDatabaseData.suspend_conf, `/api/v1/${suspendedStatus}/database/index.php?domain=${controlPanelFocusedElement}`);
  }

  const handleDelete = () => {
    const { databases } = state;
    let currentDatabaseData = databases.filter(database => database.NAME === controlPanelFocusedElement)[0];

    displayModal(currentDatabaseData.delete_conf, `/api/v1/delete/database/index.php?domain=${controlPanelFocusedElement}`);
  }

  const fetchData = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      getDatabaseList()
        .then(result => {
          setState({
            ...state,
            databases: reformatData(result.data.data),
            dbAdmin: result.data.db_admin,
            dbAdminLink: result.data.db_admin_link,
            dbFav: result.data.dbFav,
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
    let databases = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      databases.push(data[i]);
    }

    return databases;
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const databases = () => {
    const { databases } = state;
    const result = [];
    const dbFav = { ...state.dbFav };

    databases.forEach(database => {
      database.FOCUSED = controlPanelFocusedElement === database.NAME;

      if (dbFav[database.NAME]) {
        database.STARRED = dbFav[database.NAME];
      } else {
        database.STARRED = 0;
      }

      result.push(database);
    });

    let sortedResult = sortArray(result);

    return sortedResult.map((item, index) => {
      return <Database data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, databases } = state;
    let duplicate = [...selection];
    let dbDuplicate = databases;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = dbDuplicate.findIndex(db => db.NAME === name);
    dbDuplicate[incomingItem].isChecked = !dbDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, databases: dbDuplicate, selection: duplicate });
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
    const { Date, Database, Disk, User, Host, Starred } = i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case Database: return 'DATABASE';
      case Disk: return 'U_DISK';
      case User: return 'DBUSER';
      case Host: return 'HOST';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    const { dbFav } = state;
    let dbFavDuplicate = dbFav;

    if (type === 'add') {
      dbFavDuplicate[value] = 1;

      addFavorite(value, 'db')
        .then(() => {
          setState({ ...state, dbFav: dbFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      dbFavDuplicate[value] = undefined;

      deleteFavorite(value, 'db')
        .then(() => {
          setState({ ...state, dbFav: dbFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const databasesDuplicate = [...state.databases];

    if (toggled) {
      let dbNames = []

      let databases = databasesDuplicate.map(database => {
        dbNames.push(database.NAME);
        database.isChecked = true;
        return database;
      });

      setState({ ...state, databases, selection: dbNames, toggledAll: toggled });
    } else {
      let databases = databasesDuplicate.map(database => {
        database.isChecked = false;
        return database;
      });

      setState({ ...state, databases, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;

    if (selection.length && action) {
      setLoading(true);
      bulkAction(action, selection)
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
    <div className="databases">
      <Helmet>
        <title>{`Vesta - ${i18n.DB}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name="Add Database" href="/add/db" showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <a href={state.dbAdminLink} className="button-extra" type="submit" target="_blank" rel="noopener noreferrer">{state.dbAdmin}</a>
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='dbList' bulkAction={bulk} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="dbList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="mails-wrapper">
        {loading
          ? <Spinner />
          : (<>
            {databases()}
            <div className="total">{state.totalAmount}</div>
          </>)}
      </div>
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default Databases;
