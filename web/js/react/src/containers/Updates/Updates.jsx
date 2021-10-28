import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import { bulkAction, getUpdatesList, enableAutoUpdate, disableAutoUpdate } from '../../ControlPanelService/Updates';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Modal from 'src/components/ControlPanel/Modal/Modal';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import Update from '../../components/Update/Update';
import './Updates.scss';
import { Helmet } from 'react-helmet';

const Updates = props => {
  const { i18n } = useSelector(state => state.session);
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    updates: [],
    selection: [],
    autoUpdate: '',
    token: '',
    loading: false,
    toggledAll: false
  });
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/updates/'));
    dispatch(removeFocusedElement());
    dispatch(removeControlPanelContentFocusedElement());
    fetchData();

    return () => {
      dispatch(removeControlPanelContentFocusedElement());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleContentSelection);

    return () => {
      window.removeEventListener("keydown", handleContentSelection);
    };
  }, [controlPanelFocusedElement, focusedElement, state.updates]);

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

  const initFocusedElement = updates => {
    updates[0]['FOCUSED'] = updates[0]['NAME'];
    setState({ ...state, updates });
    dispatch(addControlPanelContentFocusedElement(updates[0]['NAME']));
  }

  const handleArrowDown = () => {
    let updates = [...state.updates];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(updates);
      return;
    }

    let focusedElementPosition = updates.findIndex(update => update.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== updates.length - 1) {
      let nextFocusedElement = updates[focusedElementPosition + 1];
      updates[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, updates });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let updates = [...state.updates];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(updates);
      return;
    }

    let focusedElementPosition = updates.findIndex(update => update.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = updates[focusedElementPosition - 1];
      updates[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, updates });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const fetchData = () => {
    setState({ ...state, loading: true });

    getUpdatesList()
      .then(result => {
        setState({
          ...state,
          selection: [],
          updates: reformatData(result.data.data),
          autoUpdate: result.data.autoUpdate,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let updates = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      updates.push(data[i]);
    }

    return updates;
  }

  const updates = () => {
    let updates = [...state.updates];

    updates.forEach(update => {
      update.FOCUSED = controlPanelFocusedElement === update.NAME;
    });

    return updates.map((item, index) => {
      return <Update data={item} key={index} checkItem={checkItem} />;
    });
  }

  const checkItem = name => {
    let duplicate = [...state.selection];
    let updatesDuplicate = [...state.updates];
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = updatesDuplicate.findIndex(update => update.NAME === name);
    updatesDuplicate[incomingItem].isChecked = !updatesDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, updates: updatesDuplicate, selection: duplicate });
  }

  const toggleAll = toggled => {
    const updatesDuplicate = [...state.updates];

    if (toggled) {
      let updateNames = [];

      let updates = updatesDuplicate.map(update => {
        updateNames.push(update.NAME);
        update.isChecked = true;
        return update;
      });

      setState({ ...state, updates, selection: updateNames, toggledAll: toggled });
    } else {
      let updates = updatesDuplicate.map(update => {
        update.isChecked = false;
        return update;
      });

      setState({ ...state, updates, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;

    if (selection.length && action !== 'apply to selected') {
      bulkAction(action, selection)
        .then(res => {
          toggleAll(false);
          if (res.status === 200) {
            if (res.data.error) {
              setState({ ...state, loading: false });
              return displayModal(res.data.error, '');
            }

            displayModal(res.data.message, '');
            fetchData();
          }
        })
        .catch(err => console.error(err));
    }
  }

  const handleAutoUpdate = () => {
    if (state.autoUpdate === 'Enabled') {
      disableAutoUpdate()
        .then(res => {
          if (res.data.error) {
            setState({ ...state, loading: false });
            return displayModal(res.data.error, '');
          }

          displayModal(res.data.message, '');
          fetchData();
        })
        .catch(err => {
          setState({ ...state, loading: false });
          console.error(err);
        });
    } else {
      enableAutoUpdate()
        .then(res => {
          if (res.data.error) {
            setState({ ...state, loading: false });
            return displayModal(res.data.error, '');
          }

          displayModal(res.data.message, '');
          fetchData();
        })
        .catch(err => {
          setState({ ...state, loading: false });
          console.error(err);
        });
    }
  }

  const displayModal = (text, url) => {
    setState({ ...state, loading: true });
    setModal({
      ...modal,
      visible: true,
      text: text,
      actionUrl: url
    });
  }

  const modalCancelHandler = () => {
    setModal({
      ...modal,
      visible: false,
      text: '',
      actionUrl: ''
    });
  }

  const printAutoUpdateButtonName = () => {
    if (state.autoUpdate === 'Enabled') {
      return i18n['disable autoupdate'];
    } else {
      return i18n['enable autoupdate'];
    }
  }

  return (
    <div className="statistics-list updates">
      <Helmet>
        <title>{`Vesta - ${i18n.UPDATES}`}</title>
      </Helmet>
      <Toolbar mobile={false} className="justify-right">
        <LeftButton name="Add Cron Job" showLeftMenu={false} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <button onClick={handleAutoUpdate} className="button-extra">{printAutoUpdateButtonName()}</button>
            <Checkbox toggleAll={toggleAll} />
            <Select list='updatesList' bulkAction={bulk} />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      {state.loading ? <Spinner /> : updates()}
      <Modal
        onSave={modalCancelHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default Updates;