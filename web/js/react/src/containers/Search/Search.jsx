import React, { Component, useEffect, useState } from 'react';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { getSearchResultsList, handleAction } from '../../ControlPanelService/Search';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import SearchItem from '../../components/Searchitem/SearchItem';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import './Search.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { refreshCounters } from 'src/actions/MenuCounters/menuCounterActions';

const Search = props => {
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    searchResults: [],
    totalAmount: '',
    sorting: i18n.Date,
    order: "descending",
    total: 0
  });
  const [modal, setModal] = useState({
    visible: false,
    text: '',
    actionUrl: ''
  });

  useEffect(() => {
    const { search } = history.location;

    if (search) {
      let searchTerm = search.split('=')[1];

      if (searchTerm !== '') {
        fetchData(searchTerm).then(() => setLoading(false));
      } else {
        return history.push({ pathname: '/list/user/', search: '' });
      }
    } else if (props.searchTerm !== '') {
      fetchData(props.searchTerm).then(() => setLoading(false));
    } else {
      return history.push({ pathname: '/list/user/', search: '' });
    }
  }, []);

  const fetchData = searchTerm => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      getSearchResultsList(searchTerm)
        .then(result => {
          setState({
            ...state,
            searchResults: result.data.data,
            totalAmount: result.data.total
          });
          resolve();
        })
        .catch(err => console.error(err));
    });
  }

  const searchResults = () => {
    const { searchResults } = state;
    const result = [];

    for (let i in searchResults) {
      result.push(searchResults[i]);
    }

    let sortedResult = sortArray(result);

    return sortedResult.map((item, index) => {
      return <SearchItem data={item} key={index} handleModal={displayModal} />;
    });
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const sortArray = array => {
    const { order, sorting } = state;
    let sortBy = sortByHandler(sorting);

    if (order === "descending") {
      return array.sort((a, b) => (a[sortBy] < b[sortBy]) ? 1 : ((b[sortBy] < a[sortBy]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0));
    }
  }

  const sortByHandler = sorting => {
    const { Date, Name, Starred } = i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case Name: return 'RESULT';
      default: break;
    }
  }

  const displayModal = (text, url) => {
    setModal({
      ...modal,
      visible: !modal.visible,
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

  return (
    <div className="logs-list">
      <Toolbar mobile={false}>
        <div className="search-toolbar-name">{i18n['Search Results']}</div>
        <div className="search-toolbar-right">
          <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="searchList" />
          <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
        </div>
      </Toolbar>
      <div className="statistics-wrapper">
        {loading
          ? <Spinner />
          : (<>
            {searchResults()}
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

export default Search;
