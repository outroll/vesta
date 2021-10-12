import React, { useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from "../../actions/MainNavigation/mainNavigationActions";
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { bulkAction, getUsersList, handleAction } from '../../ControlPanelService/Users';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import User from '../../components/User/User';
import { Helmet } from 'react-helmet';
import './Users.scss';

const Users = props => {
  const { i18n } = window.GLOBAL.App;
  const { token, userName } = useSelector(state => state.session);
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: ''
  });
  const [state, setState] = useState({
    users: [],
    userFav: [],
    loading: false,
    toggledAll: false,
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/user/'));
    dispatch(removeFocusedElement());
    dispatch(removeControlPanelContentFocusedElement());
    fetchData();

    return () => {
      dispatch(removeControlPanelContentFocusedElement());
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [userName]);

  useEffect(() => {
    window.addEventListener("keydown", handleContentSelection);
    window.addEventListener("keydown", handleFocusedElementShortcuts);

    return () => {
      window.removeEventListener("keydown", handleContentSelection);
      window.removeEventListener("keydown", handleFocusedElementShortcuts);
    };
  }, [controlPanelFocusedElement, focusedElement, state.users]);

  const fetchData = () => {
    setState({ ...state, loading: true });

    getUsersList()
      .then(result => {
        setState({
          ...state,
          users: reformatData(result.data.data),
          userFav: result.data.userFav,
          totalAmount: result.data.totalAmount,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 76: return handleLogin();
        case 83: return handleSuspend();
        case 8: return handleDelete();
        case 13: return handleEdit();
        default: break;
      }
    }
  }

  const handleLogin = () => {
    if (userName === controlPanelFocusedElement) {
      props.history.push('/logout');
    } else {
      props.history.push(`/login/?loginas=${controlPanelFocusedElement}`);
    }
  }

  const handleEdit = () => {
    props.history.push(`/edit/user?user=${controlPanelFocusedElement}`);
  }

  const handleSuspend = () => {
    const { users } = state;
    let currentUserData = users.filter(user => user.NAME === controlPanelFocusedElement)[0];
    let suspendedStatus = currentUserData.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';

    displayModal(currentUserData.spnd_conf, `/${suspendedStatus}/user?user=${controlPanelFocusedElement}&token=${token}`);
  }

  const handleDelete = () => {
    const { users } = state;
    let currentUserData = users.filter(user => user.NAME === controlPanelFocusedElement)[0];

    displayModal(currentUserData.delete_conf, `/delete/user?user=${controlPanelFocusedElement}&token=${token}`);
  }

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

  const initFocusedElement = users => {
    users[0]['FOCUSED'] = users[0]['NAME'];
    setState({ ...state, users });
    dispatch(addControlPanelContentFocusedElement(users[0]['NAME']));
  }

  const handleArrowDown = () => {
    let users = [...state.users];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(users);
      return;
    }

    let focusedElementPosition = users.findIndex(user => user.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== users.length - 1) {
      let nextFocusedElement = users[focusedElementPosition + 1];
      users[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, users });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let users = [...state.users];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(users);
      return;
    }

    let focusedElementPosition = users.findIndex(user => user.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = users[focusedElementPosition - 1];
      users[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, users });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const reformatData = data => {
    let users = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['isChecked'] = false;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      users.push(data[i]);
    }

    return users;
  }

  const users = () => {
    const userFav = { ...state.userFav };
    let users = [...state.users];

    users.forEach(user => {
      user.FOCUSED = controlPanelFocusedElement === user.NAME;

      if (userFav[user.NAME]) {
        user.STARRED = userFav[user.NAME];
      } else {
        user.STARRED = 0;
      }
    });

    let sortedResult = sortArray(users);

    return sortedResult.map((item, index) => {
      return <User data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, users } = state;
    let duplicate = [...selection];
    let userDuplicate = [...users];
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = userDuplicate.findIndex(user => user.NAME === name);
    userDuplicate[incomingItem].isChecked = !userDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, users: userDuplicate, selection: duplicate });
  }

  const sortArray = array => {
    let sortingColumn = sortBy(state.sorting);

    if (state.order === "descending") {
      return array.sort((a, b) => (a[sortingColumn] < b[sortingColumn]) ? 1 : ((b[sortingColumn] < a[sortingColumn]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[sortingColumn] > b[sortingColumn]) ? 1 : ((b[sortingColumn] > a[sortingColumn]) ? -1 : 0));
    }
  }

  const sortBy = sorting => {
    const { Date: date, Username, Disk, Bandwidth, Starred } = i18n;

    switch (sorting) {
      case date: return 'DATE';
      case Username: return 'NAME';
      case Disk: return 'U_DISK';
      case Bandwidth: return 'U_BANDWIDTH';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    let userFavDuplicate = state.userFav;

    if (type === 'add') {
      userFavDuplicate[value] = 1;

      addFavorite(value, 'user')
        .then(() => {
          setState({ ...state, userFav: userFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      userFavDuplicate[value] = undefined;

      deleteFavorite(value, 'user')
        .then(() => {
          setState({ ...state, userFav: userFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const usersDuplicate = [...state.users];

    if (toggled) {
      let userNames = [];

      let users = usersDuplicate.map(user => {
        userNames.push(user.NAME);
        user.isChecked = true;
        return user;
      });

      setState({ ...state, users, selection: userNames, toggledAll: toggled });
    } else {
      let users = usersDuplicate.map(user => {
        user.isChecked = false;
        return user;
      });

      setState({ ...state, users, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    if (state.selection.length && action) {
      setState({ ...state, loading: true });

      bulkAction(action, state.selection)
        .then(result => {
          if (result.status === 200) {
            fetchData();
            toggleAll(false);
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
    modalCancelHandler();
    setState({ ...state, loading: true });
    handleAction(modal.actionUrl)
      .then(() => {
        fetchData();
      })
      .catch(err => console.error(err));
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
    <div>
      <Helmet>
        <title>{`Vesta - ${i18n.USER}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name={i18n['Add User']} href="/add/user/" showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='usersList' bulkAction={bulk} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="usersList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="users-wrapper">
        {state.loading
          ? <Spinner />
          : (<>
            {users()}
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

export default Users;
