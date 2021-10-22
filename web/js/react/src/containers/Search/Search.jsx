import React, { Component, useEffect, useState } from 'react';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { getSearchResultsList, handleAction } from '../../ControlPanelService/Search';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import SearchItem from '../../components/Searchitem/SearchItem';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import './Search.scss';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Search = props => {
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const [state, setState] = useState({
    searchResults: [],
    totalAmount: '',
    sorting: i18n.Date,
    order: "descending",
    loading: false,
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
        fetchData(searchTerm);
      } else {
        return history.push({ pathname: '/list/user/', search: '' });
      }
    } else if (props.searchTerm !== '') {
      fetchData(props.searchTerm);
    } else {
      return history.push({ pathname: '/list/user/', search: '' });
    }
  }, []);

  const fetchData = searchTerm => {
    setState({ ...state, loading: true });
    getSearchResultsList(searchTerm)
      .then(result => {
        setState({
          ...state,
          searchResults: result.data.data,
          totalAmount: result.data.total_amount,
          loading: false
        });
      })
      .catch(err => console.error(err));
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
      case Starred: return 'STARRED';
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
    handleAction(state.modalActionUrl)
      .then(() => {
        fetchData();
        modalCancelHandler();
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
    <div className="logs-list">
      <Toolbar mobile={false}>
        <div className="search-toolbar-name">{i18n['Search Results']}</div>
        <div className="search-toolbar-right">
          <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="searchList" />
          <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
        </div>
      </Toolbar>
      <div className="statistics-wrapper">
        {state.loading ? <Spinner /> : searchResults()}
      </div>
      <div className="total">{state.totalAmount}</div>
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}

export default Search;
