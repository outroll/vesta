import React, { useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import { bulkAction, getBackupList, handleAction, scheduleBackup } from '../../ControlPanelService/Backup';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import Backup from '../../components/Backup/Backup';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './Backups.scss';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';

const Backups = props => {
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
    backups: [],
    backupFav: [],
    toggledAll: false,
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/backup/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.backups]);

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

  const initFocusedElement = backups => {
    backups[0]['FOCUSED'] = backups[0]['NAME'];
    setState({ ...state, backups });
    dispatch(addControlPanelContentFocusedElement(backups[0]['NAME']));
  }

  const handleArrowDown = () => {
    let backups = [...state.backups];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(backups);
      return;
    }

    let focusedElementPosition = backups.findIndex(backup => backup.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== backups.length - 1) {
      let nextFocusedElement = backups[focusedElementPosition + 1];
      backups[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, backups });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let backups = [...state.backups];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(backups);
      return;
    }

    let focusedElementPosition = backups.findIndex(backup => backup.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = backups[focusedElementPosition - 1];
      backups[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, backups });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 8: return handleDelete();
        case 13: return configureRestoreSettings();
        case 68: return download();
        default: break;
      }
    }
  }

  const configureRestoreSettings = () => {
    props.history.push(`/list/backup?backup=${controlPanelFocusedElement}`);
  }

  const download = () => {
    window.open(`/api/v1/download/backup?backup=${controlPanelFocusedElement}`);
  }

  const handleDelete = () => {
    const { backups } = state;
    let currentBackupData = backups.filter(backup => backup.NAME === controlPanelFocusedElement)[0];

    displayModal(currentBackupData.delete_conf, `/api/v1/delete/cron/?job=${controlPanelFocusedElement}`);
  }

  const fetchData = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      getBackupList()
        .then(result => {
          setState({
            ...state,
            backups: reformatData(result.data.data),
            backupFav: result.data.backup_fav,
            totalAmount: result.data.totalAmount,
            selection: [],
            toggledAll: false
          });
          resolve();
        })
        .catch(err => console.error(err));
    });
  }

  const reformatData = data => {
    let backups = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['isChecked'] = false;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      backups.push(data[i]);
    }

    return backups;
  }

  const backups = () => {
    const { backups } = state;
    const result = [];
    const backupFav = { ...state.backupFav };

    backups.forEach(backup => {
      backup.FOCUSED = controlPanelFocusedElement === backup.NAME;

      if (backupFav[backup.NAME]) {
        backup.STARRED = backupFav[backup.NAME];
      } else {
        backup.STARRED = 0;
      }

      result.push(backup);
    });

    return result.map((item, index) => {
      return <Backup data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, backups } = state;
    let duplicate = [...selection];
    let backupDuplicate = [...backups];
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = backupDuplicate.findIndex(backup => backup.NAME === name);
    backupDuplicate[incomingItem].isChecked = !backupDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, backups: backupDuplicate, selection: duplicate });
  }

  const toggleFav = (value, type) => {
    const { backupFav } = state;
    let backupFavDuplicate = backupFav;

    if (type === 'add') {
      backupFavDuplicate[value] = 1;

      addFavorite(value, 'backup')
        .then(() => {
          setState({ ...state, backupFav: backupFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      backupFavDuplicate[value] = undefined;

      deleteFavorite(value, 'backup')
        .then(() => {
          setState({ ...state, backupFav: backupFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const backupsDuplicate = [...state.backups];

    if (toggled) {
      let backupNames = [];

      let backups = backupsDuplicate.map(backup => {
        backupNames.push(backup.NAME);
        backup.isChecked = true;
        return backup;
      });

      setState({ ...state, backups, selection: backupNames, toggledAll: toggled });
    } else {
      let backups = backupsDuplicate.map(backup => {
        backup.isChecked = false;
        return backup;
      });
      setState({ ...state, backups, selection: [], toggledAll: toggled });
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
    setLoading(false);
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

  const scheduleBackupButton = () => {
    setLoading(true);
    scheduleBackup()
      .then(result => {
        if (result.data.error) {
          displayModal(result.data.error, '');
        } else {
          displayModal(result.data.ok, '');
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="backups">
      <Helmet>
        <title>{`Vesta - ${i18n.BACKUP}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <div className="l-menu">
          <button onClick={scheduleBackupButton}>
            <FontAwesomeIcon icon="plus" />
            <span className="add">{i18n["Create Backup"]}</span>
          </button>
        </div>
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Link to='/list/backup/exclusions' className="button-extra" type="submit">{i18n['backup exclusions']}</Link>
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='backupList' bulkAction={bulk} />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="backups-wrapper">
        {loading
          ? <Spinner />
          : (<>
            {backups()}
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

export default Backups;
