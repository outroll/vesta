import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { getStatisticsList } from '../../ControlPanelService/Statistics';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Statistic from '../../components/Statistic/Statistic';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Statistics.scss';
import { Helmet } from 'react-helmet';

const Statistics = props => {
  const { i18n } = window.GLOBAL.App;
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    statistics: [],
    users: [],
    totalAmount: '',
    loading: false,
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/stats/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.statistics]);

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

  const initFocusedElement = statistics => {
    statistics[0]['FOCUSED'] = statistics[0]['NAME'];
    setState({ ...state, statistics });
    dispatch(addControlPanelContentFocusedElement(statistics[0]['NAME']));
  }

  const handleArrowDown = () => {
    let statistics = [...state.statistics];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(statistics);
      return;
    }

    let focusedElementPosition = statistics.findIndex(statistic => statistic.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== statistics.length - 1) {
      let nextFocusedElement = statistics[focusedElementPosition + 1];
      statistics[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, statistics });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let statistics = [...state.statistics];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(statistics);
      return;
    }

    let focusedElementPosition = statistics.findIndex(statistic => statistic.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = statistics[focusedElementPosition - 1];
      statistics[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, statistics });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const fetchData = () => {
    dispatch(removeControlPanelContentFocusedElement());
    setState({ ...state, loading: true });

    let search = window.location.search;
    let user = search ? search.split('=')[1] : '';

    getStatisticsList(user)
      .then(result => {
        setState({
          ...state,
          statistics: reformatData(result.data.data),
          users: result.data.users || [],
          totalAmount: result.data.totalAmount,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let statistics = [];

    for (let i in data) {
      data[i]['DATE'] = i;
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      statistics.push(data[i]);
    }

    return statistics;
  }

  const statistics = () => {
    let statistics = [...state.statistics];

    statistics.forEach(statistic => {
      statistic.FOCUSED = controlPanelFocusedElement === statistic.NAME;
    });

    return statistics.map((item, index) => {
      return <Statistic data={item} key={index} />;
    });
  }

  const bulkAction = value => {
    let user = value !== '' ? `?user=${value}` : '';
    props.history.push({ search: user });
    fetchData();
  };

  return (
    <div className="statistics-list">
      <Helmet>
        <title>{`Vesta - ${i18n.STATS}`}</title>
      </Helmet>
      <Toolbar mobile={false} className="justify-right">
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Link to="/list/stats/" className="button-extra" type="submit">{i18n['Overall Statistics']}</Link>
            <Select list='statisticsList' users={state.users} bulkAction={bulkAction} />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="statistics-wrapper">
        {state.loading ? <Spinner /> : statistics()}
      </div>
      <div className="total">{state.totalAmount}</div>
    </div>
  );
}

export default Statistics;