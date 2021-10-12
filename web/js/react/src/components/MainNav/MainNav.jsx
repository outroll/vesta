import React, { useState, useEffect, useCallback } from 'react';
import { addFocusedElement, addActiveElement, removeActiveElement, removeFocusedElement } from "../../actions/MainNavigation/mainNavigationActions";
import * as ControlPanelContentActions from "../../actions/ControlPanelContent/controlPanelContentActions";
import { useSelector, useDispatch } from "react-redux";
import MobileTopNav from '../MainNav/Mobile/MobileTopNav';
import Menu from '../MainNav/Stat-menu/Menu';
import Panel from '../MainNav/Panel/Panel';
import './MainNav.scss';

const MainNav = props => {
  const [state, setState] = useState({
    menuHeight: 135,
    showTopNav: false
  });

  const { activeElement, focusedElement, menuTabs } = useSelector(state => state.mainNavigation);
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const dispatch = useDispatch();

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
        currentActiveTabPositionInArray = menuTabs.indexOf(activeElement);
      } else {
        currentActiveTabPositionInArray = menuTabs.indexOf(focusedElement);
      }
    }

    if (currentActiveTabPositionInArray === -1) {
      return;
    }

    if (event.keyCode === 37) {
      let newFocusedMenuTab = handleLeftArrowKey(menuTabs, currentActiveTabPositionInArray);
      dispatch(addFocusedElement(newFocusedMenuTab));
    } else if (event.keyCode === 39) {
      let newFocusedMenuTab = handleRightArrowKey(menuTabs, currentActiveTabPositionInArray);
      dispatch(addFocusedElement(newFocusedMenuTab));
    } else if (event.keyCode === 13) {
      if (!controlPanelFocusedElement && focusedElement) {
        props.history.push({ pathname: focusedElement });
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
    dispatch(addActiveElement(props.history.location.pathname));
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
      <Panel showTopNav={showTopNav} visibleNav={state.showTopNav} />
      {topNavigation()}
    </div>
  );
}

export default MainNav;