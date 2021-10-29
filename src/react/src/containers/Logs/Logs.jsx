import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import { getLogsList } from '../../ControlPanelService/Logs';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import Log from '../../components/Log/Log';
import './Logs.scss';
import { Helmet } from 'react-helmet';

const Logs = props => {
  const { i18n } = useSelector(state => state.session);
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    logs: [],
    totalAmount: '',
    loading: false,
    total: 0
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/log/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.logs]);

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

  const initFocusedElement = logs => {
    logs[0]['FOCUSED'] = logs[0]['NAME'];
    setState({ ...state, logs });
    dispatch(addControlPanelContentFocusedElement(logs[0]['NAME']));
  }

  const handleArrowDown = () => {
    let logs = [...state.logs];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(logs);
      return;
    }

    let focusedElementPosition = logs.findIndex(log => log.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== logs.length - 1) {
      let nextFocusedElement = logs[focusedElementPosition + 1];
      logs[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, logs });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let logs = [...state.logs];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(logs);
      return;
    }

    let focusedElementPosition = logs.findIndex(log => log.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = logs[focusedElementPosition - 1];
      logs[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, logs });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const fetchData = () => {
    setState({ ...state, loading: true });

    getLogsList()
      .then(result => {
        setState({
          logs: reformatData(result.data.data),
          totalAmount: result.data.totalAmount,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let logs = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      logs.push(data[i]);
    }

    return logs;
  }

  const logs = () => {
    let logs = [...state.logs];

    logs.forEach(log => {
      log.FOCUSED = controlPanelFocusedElement === log.NAME;
    });

    return logs.map((item, index) => {
      return <Log data={item} key={index} />;
    });
  }

  return (
    <div className="logs-list">
      <Helmet>
        <title>{`Vesta - ${i18n.LOG}`}</title>
      </Helmet>
      <Toolbar mobile={false} className="justify-right">
        <LeftButton name="Add Cron Job" showLeftMenu={false} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="logs-wrapper">
        {state.loading ? <Spinner /> : logs()}
      </div>
      <div className="total">{state.totalAmount}</div>
    </div>
  );
}

export default Logs;