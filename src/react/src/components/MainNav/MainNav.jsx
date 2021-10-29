import React, { useState, useEffect, useCallback } from 'react';
import { addFocusedElement, addActiveElement, removeActiveElement, removeFocusedElement } from "../../actions/MainNavigation/mainNavigationActions";
import * as ControlPanelContentActions from "../../actions/ControlPanelContent/controlPanelContentActions";
import { useSelector, useDispatch } from "react-redux";
import MobileTopNav from '../MainNav/Mobile/MobileTopNav';
import Menu from '../MainNav/Stat-menu/Menu';
import Panel from '../MainNav/Panel/Panel';
import './MainNav.scss';
import { useHistory } from 'react-router';
import Spinner from '../Spinner/Spinner';

const MainNav = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    menuHeight: 135,
    tabs: [],
    showTopNav: false
  });

  const { userName, session: { look } } = useSelector(state => state.session);
  const { user } = useSelector(state => state.menuCounters);
  const { activeElement, focusedElement, adminMenuTabs, userMenuTabs } = useSelector(state => state.mainNavigation);
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userName || !Object.entries(user).length) {
      return history.push('/login');
    }

    const tabs = look ? userMenuTabs : adminMenuTabs;
    setState({ ...state, tabs });

    setLoading(false);
  }, [userName, user, history]);

  const controlFocusedTabWithCallback = useCallback(event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus') || document.querySelector('textarea:focus');
    let currentActiveTabPositionInArray;

    if (isSearchInputFocused) {
      return;
    }

    if (event.keyCode === 37 || event.keyCode === 39) {
      if (controlPanelFocusedElement) {
        dispatch(ControlPanelContentActions.removeControlPanelContentFocusedElement());
      }

      if (!focusedElement) {
        dispatch(addFocusedElement(activeElement));
        currentActiveTabPositionInArray = state.tabs.indexOf(activeElement);
      } else {
        currentActiveTabPositionInArray = state.tabs.indexOf(focusedElement);
      }
    }

    if (currentActiveTabPositionInArray === -1) {
      return;
    }

    if (event.keyCode === 37) {
      let newFocusedMenuTab = handleLeftArrowKey(state.tabs, currentActiveTabPositionInArray);
      dispatch(addFocusedElement(newFocusedMenuTab));
    } else if (event.keyCode === 39) {
      let newFocusedMenuTab = handleRightArrowKey(state.tabs, currentActiveTabPositionInArray);
      dispatch(addFocusedElement(newFocusedMenuTab));
    } else if (event.keyCode === 13) {
      if (!controlPanelFocusedElement && focusedElement && (focusedElement !== activeElement)) {
        history.push({ pathname: focusedElement });
        dispatch(addActiveElement(focusedElement));
        dispatch(removeFocusedElement());
      }
    }
  }, [activeElement, focusedElement, controlPanelFocusedElement]);

  useEffect(() => {
    window.addEventListener("resize", handleTopNav);
    window.addEventListener("keyup", controlFocusedTabWithCallback);
    window.addEventListener("scroll", hideMenu);

    return () => {
      window.removeEventListener("resize", handleTopNav);
      window.removeEventListener("keyup", controlFocusedTabWithCallback);
      window.removeEventListener("scroll", hideMenu);
    };
  }, [controlFocusedTabWithCallback]);

  useEffect(() => {
    dispatch(removeFocusedElement());
  }, [activeElement]);

  useEffect(() => {
    dispatch(addActiveElement(history.location.pathname));
  }, []);

  const handleLeftArrowKey = (array, indexInArray) => {
    if (indexInArray === 0) {
      return array[array.length - 1];
    } else {
      return array[indexInArray - 1];
    }
  }

  const handleRightArrowKey = (array, indexInArray) => {
    if (indexInArray === (array.length - 1)) {
      return array[0];
    } else {
      return array[indexInArray + 1];
    }
  }

  const handleTopNav = () => {
    if (document.documentElement.clientWidth < 900) {
      setState({
        ...state,
        menuHeight: 45
      });
    } else {
      setState({
        ...state,
        menuHeight: 135
      });
    }
  }

  const hideMenu = () => {
    if (document.documentElement.clientWidth > 900) {
      let scrollTop = window.scrollY;
      let menuHeight = Math.max(45, 135 - scrollTop);
      setState({ ...state, menuHeight });
    }
  }

  const showTopNav = () => {
    let showTopNav = !state.showTopNav;
    setState({ ...state, showTopNav });
  }

  const topNavClassName = () => {
    if (state.showTopNav) {
      return "nav-wrapper show-nav";
    } else {
      return "nav-wrapper hide-nav";
    }
  }

  const topNavMobile = () => {
    if (state.showTopNav) {
      return "mobile-top-nav-wrapper show";
    } else {
      return "mobile-top-nav-wrapper hide";
    }
  }
  const topNavigation = () => {
    if (document.documentElement.clientWidth > 900) {
      return (
        <div className={topNavClassName()}>
          <Menu menuHeight={state.menuHeight} mobile={false} />
        </div>
      );
    } else {
      return <MobileTopNav class={topNavMobile()} />;
    }
  }

  return (
    <div className="main-nav">
      {
        loading
          ? <Spinner />
          : (<>
            <Panel showTopNav={showTopNav} visibleNav={state.showTopNav} />
            {topNavigation()}
          </>)
      }
    </div>
  );
}

export default MainNav;