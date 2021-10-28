import React, { useEffect, useState } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { addActiveElement, removeFocusedElement } from '../../actions/MainNavigation/mainNavigationActions';
import { bulkAction, getPackageList, handleAction } from '../../ControlPanelService/Package';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Package from '../../components/Package/Package';
import Spinner from '../../components/Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import './Packages.scss';
import { Helmet } from 'react-helmet';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';

const Packages = props => {
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
    packages: [],
    packagesFav: [],
    toggledAll: false,
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/package/'));
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
  }, [controlPanelFocusedElement, focusedElement, state.packages]);

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

  const initFocusedElement = packages => {
    packages[0]['FOCUSED'] = packages[0]['NAME'];
    setState({ ...state, packages });
    dispatch(addControlPanelContentFocusedElement(packages[0]['NAME']));
  }

  const handleArrowDown = () => {
    let packages = [...state.packages];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(packages);
      return;
    }

    let focusedElementPosition = packages.findIndex(pack => pack.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== packages.length - 1) {
      let nextFocusedElement = packages[focusedElementPosition + 1];
      packages[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, packages });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let packages = [...state.packages];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(packages);
      return;
    }

    let focusedElementPosition = packages.findIndex(pack => pack.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = packages[focusedElementPosition - 1];
      packages[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, packages });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 8: return handleDelete();
        case 13: return handleEdit();
        default: break;
      }
    }
  }

  const handleEdit = () => {
    props.history.push(`/edit/package/?package=${controlPanelFocusedElement}`);
  }

  const handleDelete = () => {
    const { packages } = state;
    let currentPackageData = packages.filter(pack => pack.NAME === controlPanelFocusedElement)[0];

    displayModal(currentPackageData.delete_conf, `/api/v1/delete/package/index.php?package=${controlPanelFocusedElement}`);
  }

  const fetchData = () => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      getPackageList()
        .then(result => {
          setState({
            ...state,
            packages: reformatData(result.data.data),
            packagesFav: result.data.packagesFav,
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
    let packages = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      packages.push(data[i]);
    }

    return packages;
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const packages = () => {
    const { packages } = state;
    const packagesFav = { ...state.packagesFav };
    const result = [];

    packages.forEach(pack => {
      pack.FOCUSED = controlPanelFocusedElement === pack.NAME;

      if (packagesFav[pack.NAME]) {
        pack.STARRED = packagesFav[pack.NAME];
      } else {
        pack.STARRED = 0;
      }

      result.push(pack);
    });

    let sortedResult = sortArray(result);

    return sortedResult.map((item, index) => {
      return <Package data={item} key={index} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, packages } = state;
    let duplicate = [...selection];
    let packagesDuplicate = packages;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = packagesDuplicate.findIndex(pack => pack.NAME === name);
    packagesDuplicate[incomingItem].isChecked = !packagesDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, packages: packagesDuplicate, selection: duplicate });
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
    const { Date, Starred } = i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case i18n['Package Name']: return 'NAME';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    const { packagesFav } = state;
    let packagesFavDuplicate = packagesFav;

    if (type === 'add') {
      packagesFavDuplicate[value] = 1;

      addFavorite(value, 'package')
        .then(() => {
          setState({ ...state, packagesFav: packagesFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      packagesFavDuplicate[value] = undefined;

      deleteFavorite(value, 'package')
        .then(() => {
          setState({ ...state, packagesFav: packagesFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const packagesDuplicate = [...state.packages];

    if (toggled) {
      let packageNames = [];

      let packages = packagesDuplicate.map(pack => {
        packageNames.push(pack.NAME);
        pack.isChecked = true;
        return pack;
      });

      setState({ ...state, packages, selection: packageNames, toggledAll: toggled });
    } else {
      let packages = packagesDuplicate.map(pack => {
        pack.isChecked = false;
        return pack;
      });

      setState({ ...state, packages, selection: [], toggledAll: toggled });
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

  const displayModal = (text, actionUrl) => {
    setModal({ ...modal, visible: !modal.visible, text, actionUrl })
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
    setModal({ ...modal, visible: false, text: '', actionUrl: '' })
  }

  return (
    <div className="packages">
      <Helmet>
        <title>{`Vesta - ${i18n.PACKAGE}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name={i18n['Add Package']} href="/add/package/" showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='packagesList' bulkAction={bulk} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="packagesList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      <div className="packages-wrapper">
        {
          loading
            ? <Spinner />
            : (<>
              {packages()}
              <div className="total">{state.totalAmount}</div>
            </>)
        }
      </div>
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default Packages;
