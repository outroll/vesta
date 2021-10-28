import React, { useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { bulkAction, getCronList, handleAction } from '../../ControlPanelService/Cron';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import CronJob from '../../components/CronJob/CronJob';
import Spinner from '../../components/Spinner/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import './CronJobs.scss';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';

const CronJobs = props => {
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
    cronJobs: [],
    cronFav: [],
    toggledAll: false,
    cronReports: '',
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/cron/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.cronJobs]);

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

  const initFocusedElement = cronJobs => {
    cronJobs[0]['FOCUSED'] = cronJobs[0]['NAME'];
    setState({ ...state, cronJobs });
    dispatch(addControlPanelContentFocusedElement(cronJobs[0]['NAME']));
  }

  const handleArrowDown = () => {
    let cronJobs = [...state.cronJobs];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(cronJobs);
      return;
    }

    let focusedElementPosition = cronJobs.findIndex(cronJob => cronJob.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== cronJobs.length - 1) {
      let nextFocusedElement = cronJobs[focusedElementPosition + 1];
      cronJobs[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, cronJobs });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let cronJobs = [...state.cronJobs];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(cronJobs);
      return;
    }

    let focusedElementPosition = cronJobs.findIndex(cronJob => cronJob.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = cronJobs[focusedElementPosition - 1];
      cronJobs[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, cronJobs });
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
    props.history.push(`/edit/cron?job=${controlPanelFocusedElement}`);
  }

  const handleSuspend = () => {
    const { cronJobs } = state;
    let currentCronJobData = cronJobs.filter(cronJob => cronJob.NAME === controlPanelFocusedElement)[0];
    let suspendedStatus = currentCronJobData.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';

    displayModal(currentCronJobData.suspend_conf, `/api/v1/${suspendedStatus}/cron/index.php?job=${controlPanelFocusedElement}`);
  }

  const handleDelete = () => {
    const { cronJobs } = state;
    let currentCronJobData = cronJobs.filter(cronJob => cronJob.NAME === controlPanelFocusedElement)[0];

    displayModal(currentCronJobData.delete_conf, `/api/v1/delete/cron/index.php?job=${controlPanelFocusedElement}`);
  }

  const fetchData = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      getCronList()
        .then(result => {
          setState({
            ...state,
            cronJobs: reformatData(result.data.data),
            cronReports: result.data.cron_reports,
            cronFav: result.data.cron_fav,
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
    let cronJobs = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['isChecked'] = false;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      cronJobs.push(data[i]);
    }

    return cronJobs;
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const cronJobs = () => {
    const { cronJobs } = state;
    const result = [];
    const cronFav = { ...state.cronFav };

    cronJobs.forEach(cronJob => {
      cronJob.FOCUSED = controlPanelFocusedElement === cronJob.NAME;

      if (cronFav[cronJob.NAME]) {
        cronJob.STARRED = cronFav[cronJob.NAME];
      } else {
        cronJob.STARRED = 0;
      }

      result.push(cronJob);
    });

    let sortedResult = sortArray(result);

    return sortedResult.map((item, index) => {
      return <CronJob data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, cronJobs } = state;
    let duplicate = [...selection];
    let cronDuplicate = cronJobs;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = cronDuplicate.findIndex(cronJob => cronJob.NAME === name);
    cronDuplicate[incomingItem].isChecked = !cronDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, cronJobs: cronDuplicate, selection: duplicate });
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
    const { Date, Command, Starred } = i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case Command: return 'CMD';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    const { cronFav } = state;
    let cronFavDuplicate = cronFav;

    if (type === 'add') {
      cronFavDuplicate[value] = 1;

      addFavorite(value, 'cron')
        .then(() => {
          setState({ ...state, cronFav: cronFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      cronFavDuplicate[value] = undefined;

      deleteFavorite(value, 'cron')
        .then(() => {
          setState({ ...state, cronFav: cronFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const cronJobsDuplicate = [...state.cronJobs];

    if (toggled) {
      let cronJobNames = [];

      let cronJobs = cronJobsDuplicate.map(cronJob => {
        cronJobNames.push(cronJob.NAME);
        cronJob.isChecked = true;
        return cronJob;
      });

      setState({ ...state, cronJobs, selection: cronJobNames, toggledAll: toggled });
    } else {
      let cronJobs = cronJobsDuplicate.map(cronJob => {
        cronJob.isChecked = false;
        return cronJob;
      });
      setState({ ...state, cronJobs, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;
    const notifications = state.cronReports === 'yes' ? 'delete-cron-reports' : 'add-cron-reports';

    if (action === notifications) {
      return handleCronNotifications();
    }

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
      visible: !state.modalVisible,
      text,
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

  const handleCronNotifications = () => {
    const token = localStorage.getItem("token");
    const url = `/api/v1/${state.cronReports === 'yes' ? 'delete' : 'add'}/cron/reports/?token=${token}`;

    handleAction(url)
      .then(res => {
        displayModal(res.data.message, '');
        fetchData();
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="cronJobs">
      <Helmet>
        <title>{`Vesta - ${i18n.CRON}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name={i18n['Add Cron Job']} href="/add/cron" showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <button onClick={handleCronNotifications} className="button-extra" type="submit">
              {state.cronReports === 'yes' ? i18n['turn off notifications'] : i18n['turn on notifications']}
            </button>
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='cronList' bulkAction={bulk} cronReports={state.cronReports === 'yes'} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="cronList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="cron-wrapper">
        {loading
          ? <Spinner />
          : (<>
            {cronJobs()}
            <div className="total">{state.totalAmount}</div>
          </>)}
      </div>
      <Modal
        showCancelButton={modal.actionUrl}
        onCancel={modalCancelHandler}
        onSave={modalConfirmHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default CronJobs;
