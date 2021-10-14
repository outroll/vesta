import React, { Component } from 'react';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import { getSearchResultsList, handleAction } from '../../ControlPanelService/Search';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import SearchItem from '../../components/Searchitem/SearchItem';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import Spinner from '../../components/Spinner/Spinner';
import './Search.scss';

class Search extends Component {
  state = {
    searchResults: [],
    totalAmount: '',
    modalText: '',
    modalVisible: false,
    modalActionUrl: '',
    sorting: window.GLOBAL.App.i18n.Date,
    order: "descending",
    loading: false,
    total: 0
  }

  componentWillMount() {
    const { search } = this.props.history.location;

    if (search) {
      let searchTerm = search.split('=')[1];

      if (searchTerm !== '') {
        this.fetchData(searchTerm);
      } else {
        return this.props.history.push({ pathname: '/list/user/', search: '' });
      }
    } else if (this.props.searchTerm !== '') {
      this.fetchData(this.props.searchTerm);
    } else {
      return this.props.history.push({ pathname: '/list/user/', search: '' });
    }
  }

  fetchData = searchTerm => {
    this.setState({ loading: true }, () => {
      getSearchResultsList(searchTerm)
        .then(result => {
          this.setState({
            searchResults: result.data.data,
            totalAmount: result.data.totalAmount,
            loading: false
          });
        })
        .catch(err => console.error(err));
    });
  }

  searchResults = () => {
    const { searchResults } = this.state;
    const result = [];

    for (let i in searchResults) {
      result.push(searchResults[i]);
    }

    let sortedResult = this.sortArray(result);

    return sortedResult.map((item, index) => {
      return <SearchItem data={item} key={index} handleModal={this.displayModal} />;
    });
  }

  changeSorting = (sorting, order) => {
    this.setState({
      sorting,
      order
    });
  }

  sortArray = array => {
    const { order, sorting } = this.state;
    let sortBy = this.sortBy(sorting);

    if (order === "descending") {
      return array.sort((a, b) => (a[sortBy] < b[sortBy]) ? 1 : ((b[sortBy] < a[sortBy]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[sortBy] > b[sortBy]) ? 1 : ((b[sortBy] > a[sortBy]) ? -1 : 0));
    }
  }

  sortBy = sorting => {
    const { Date, Name, Starred } = window.GLOBAL.App.i18n;

    switch (sorting) {
      case Date: return 'DATE';
      case Name: return 'RESULT';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  displayModal = (text, url) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      modalText: text,
      modalActionUrl: url
    });
  }

  modalConfirmHandler = () => {
    handleAction(this.state.modalActionUrl)
      .then(() => {
        this.fetchData();
        this.modalCancelHandler();
      })
      .catch(err => console.error(err));
  }

  modalCancelHandler = () => {
    this.setState({
      modalVisible: false,
      modalText: '',
      modalActionUrl: ''
    });
  }

  render() {
    return (
      <div className="logs-list">
        <Toolbar mobile={false}>
          <div className="search-toolbar-name">{window.GLOBAL.App.i18n['Search Results']}</div>
          <div className="search-toolbar-right">
            <DropdownFilter changeSorting={this.changeSorting} sorting={this.state.sorting} order={this.state.order} list="searchList" />
            <SearchInput handleSearchTerm={term => this.props.changeSearchTerm(term)} />
          </div>
        </Toolbar>
        <div className="statistics-wrapper">
          {this.state.loading ? <Spinner /> : this.searchResults()}
        </div>
        <div className="total">{this.state.totalAmount}</div>
        <Modal
          onSave={this.modalConfirmHandler}
          onCancel={this.modalCancelHandler}
          show={this.state.modalVisible}
          text={this.state.modalText} />
      </div>
    );
  }
}

export default Search;