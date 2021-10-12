import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from 'src/actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from 'src/actions/MainNavigation/mainNavigationActions';
import * as MainNavigation from 'src/actions/MainNavigation/mainNavigationActions';
import SearchInput from 'src/components/MainNav/Toolbar/SearchInput/SearchInput';
import LeftButton from 'src/components/MainNav/Toolbar/LeftButton/LeftButton';
import Toolbar from 'src/components/MainNav/Toolbar/Toolbar';
import Spinner from 'src/components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import Exclusion from 'src/components/Backup/Exclusion';
import { getBackupExclusions } from 'src/ControlPanelService/Backup';

const BackupExclusions = props => {
  const { i18n } = window.GLOBAL.App;
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    exclusions: [],
    loading: false,
    total: 0
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/backup/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.exclusions]);

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

  const initFocusedElement = exclusions => {
    exclusions[0]['FOCUSED'] = exclusions[0]['NAME'];
    setState({ ...state, exclusions });
    dispatch(addControlPanelContentFocusedElement(exclusions[0]['NAME']));
  }

  const handleArrowDown = () => {
    let exclusions = [...state.exclusions];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(exclusions);
      return;
    }

    let focusedElementPosition = exclusions.findIndex(exclusion => exclusion.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== exclusions.length - 1) {
      let nextFocusedElement = exclusions[focusedElementPosition + 1];
      exclusions[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, exclusions });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let exclusions = [...state.exclusions];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(exclusions);
      return;
    }

    let focusedElementPosition = exclusions.findIndex(exclusion => exclusion.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = exclusions[focusedElementPosition - 1];
      exclusions[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, exclusions });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const fetchData = () => {
    setState({ ...state, loading: true });

    getBackupExclusions()
      .then(result => {
        setState({
          exclusions: reformatData(result.data.data),
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let exclusions = [];

    for (let i in data) {
      exclusions.push({ NAME: i, ITEMS: data[i] });
    }

    return exclusions;
  }

  const exclusions = () => {
    return state.exclusions.map((item, index) => <Exclusion data={item} key={index} focused={controlPanelFocusedElement === item.NAME} />);
  }

  return (
    <div className="exclusions-list">
      <Helmet>
        <title>{`Vesta - ${i18n.BACKUP}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <LeftButton href="/edit/backup/exclusions" list="server" name={i18n.configure} showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="exclusions-wrapper">
        {state.loading ? <Spinner /> : exclusions()}
      </div>
    </div>
  );
}

export default BackupExclusions;
