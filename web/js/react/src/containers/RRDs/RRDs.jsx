import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import { getRrdList } from '../../ControlPanelService/RRD';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import Timer from '../../components/RRD/Timer/Timer';
import RRD from '../../components/RRD/RRD';
import './RRDs.scss';
import { Helmet } from 'react-helmet';

const RRDs = props => {
  const { i18n } = window.GLOBAL.App;
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    period: 'daily',
    periodI18N: i18n.Daily,
    time: 15,
    loading: false,
    total: 0
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/rrd/'));
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
  }, [controlPanelFocusedElement, focusedElement, data]);

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

  const initFocusedElement = data => {
    data[0]['FOCUSED'] = data[0]['NAME'];
    setData(data);
    dispatch(addControlPanelContentFocusedElement(data[0]['NAME']));
  }

  const handleArrowDown = () => {
    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(data);
      return;
    }

    let focusedElementPosition = data.findIndex(pack => pack.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== data.length - 1) {
      let nextFocusedElement = data[focusedElementPosition + 1];
      data[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setData(data);
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(data);
      return;
    }

    let focusedElementPosition = data.findIndex(pack => pack.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = data[focusedElementPosition - 1];
      data[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setData(data);
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const countDown = () => {
    if (state.time === 0) {
      fetchData();
    } else {
      setState({ ...state, time: state.time - 1 });
    }
  }

  const fetchData = () => {
    dispatch(removeControlPanelContentFocusedElement());

    setState({ ...state, loading: true });

    getRrdList()
      .then(result => {
        setData(reformatData(result.data.data));
        setState({ ...state, time: 15, loading: false });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let rrds = [];

    for (let i in data) {
      data[i]['NAME'] = data[i]['TITLE'];
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      rrds.push(data[i]);
    }

    return rrds;
  }

  const rrds = () => {
    let dataDuplicate = [...data];

    dataDuplicate.forEach(rrd => {
      rrd.FOCUSED = controlPanelFocusedElement === rrd.NAME;
    });

    return dataDuplicate.map((item, index) => {
      return <RRD period={state.period} data={item} key={index} />;
    });
  }

  const printPeriods = () => {
    const periods = [i18n.Daily, i18n.Weekly, i18n.Monthly, i18n.Yearly];

    return periods.map(period => (<div className={periodClass(period)} onClick={() => changePeriod(period)}>{period}</div>));
  }

  const periodClass = period => {
    if (state.periodI18N === period) {
      return "period active";
    } else {
      return "period";
    }
  }

  const changePeriod = period => {
    switch (period) {
      case i18n.Daily: setState({ ...state, period: 'daily', periodI18N: i18n.Daily, time: 15 }); break;
      case i18n.Weekly: setState({ ...state, period: 'weekly', periodI18N: i18n.Weekly, time: 15 }); break;
      case i18n.Monthly: setState({ ...state, period: 'monthly', periodI18N: i18n.Monthly, time: 15 }); break;
      case i18n.Yearly: setState({ ...state, period: 'yearly', periodI18N: i18n.Yearly, time: 15 }); break;
      default: break;
    }
  }

  return (
    <div className="rrd-list">
      <Helmet>
        <title>{`Vesta - ${i18n.RRD}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div className="periods-wrapper">
          {printPeriods()}
          <Timer time={state.time} countDown={countDown} data={state.rrds} />
        </div>
        <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
      </Toolbar>
      <div className="rrd-wrapper">
        {state.loading ? <Spinner /> : rrds()}
      </div>
    </div>
  );
}

export default RRDs;