import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import Path from '../../Path/Path';
import Row from '../Row/Row';
import '../List.scss';

class DirectoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderType: "descending",
      sortingType: "Type",
      itemsSelected: [],
      listingItems: [],
      cursor: 0
    };
  }

  static propTypes = {
    changePathAfterToggle: PropTypes.func,
    openCertainDirectory: PropTypes.func,
    openDirectory: PropTypes.func,
    passSelection: PropTypes.func,
    modalVisible: PropTypes.bool,
    changePath: PropTypes.func,
    addToPath: PropTypes.func,
    history: PropTypes.object,
    isActive: PropTypes.bool,
    cursor: PropTypes.number,
    passData: PropTypes.func,
    download: PropTypes.func,
    moveBack: PropTypes.func,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    path: PropTypes.string,
    list: PropTypes.string,
    data: PropTypes.array
  }

  UNSAFE_componentWillMount = () => {
    if (localStorage.getItem(`${this.props.list}Sorting`) && localStorage.getItem(`${this.props.list}Order`)) {
      this.setState({ sortingType: localStorage.getItem(`${this.props.list}Sorting`), orderType: localStorage.getItem(`${this.props.list}Order`) });
    }
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.handleLiSelection);
    document.addEventListener("keydown", this.moveBackOnButton);
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleLiSelection);
    document.removeEventListener("keydown", this.moveBackOnButton);
  }

  cacheSorting = () => {
    localStorage.setItem(`${this.props.list}Sorting`, this.state.sortingType);
    localStorage.setItem(`${this.props.list}Order`, this.state.orderType);
  }

  moveBackOnButton = (e) => {
    if (e.keyCode === 8 && !this.props.modalVisible && this.props.isActive) {
      this.moveBack();
    }
  }

  moveBack = () => {
    if (this.isHomeDirectory()) {
      return;
    }

    this.props.moveBack();
  }

  isHomeDirectory = () => {
    return this.props.path === this.props.rootDir;
  }

  toggleActiveList = () => {
    const { history, path, list, onClick, changePathAfterToggle, isActive } = this.props;

    if (!isActive) {
      onClick(list);
      changePathAfterToggle(path);
      history.push({
        pathname: '/list/directory/',
        search: `?path=${path}`
      });
      this.cacheActiveWindowAndPaths();
      this.passData();
    }
  }

  cacheActiveWindowAndPaths = () => {
    localStorage.setItem("activeWindow", this.props.list);
    localStorage.setItem(`${this.props.list}ListPath`, this.props.path);
    localStorage.setItem(`${this.props.list}ListPath`, this.props.path);
  }

  isSelected = (i) => {
    return this.state.itemsSelected.indexOf(i) !== -1;
  }

  addToSelection(i) {
    const { itemsSelected } = this.state;
    const result = [...itemsSelected];
    const duplicate = itemsSelected.indexOf(i);
    if (duplicate !== -1) {
      result.splice(duplicate, 1);
    } else {
      if (i === "") {
        return;
      }

      result.push(i)
    }

    this.setState({ itemsSelected: result });
    this.props.passSelection(result);
  }

  handleLiSelection = (e) => {
    const { isActive, modalVisible, changePath, path } = this.props;
    const { cursor } = this.state;
    const { listing } = this.getDataBySortingType()

    if (!isActive || modalVisible) {
      return;
    }

    if (e.keyCode === 40) {
      if (cursor === listing.length - 1) {
        return;
      }

      if (e.shiftKey) { 
        let name = listing[cursor].name;
        this.addToSelection(name);
      }

      this.setState({ cursor: cursor + 1 });
      this.passData();
      changePath(path);
    }

    if (e.keyCode === 38) {
      if (cursor === 0) {
        return;
      }

      if (e.shiftKey) {
        let name = listing[cursor - 1].name;
        this.addToSelection(name);
      }

      this.setState({ cursor: cursor - 1 });
      this.passData();
      changePath(path);
    }
  }

  resetData = () => {
    this.setState({ cursor: 0, itemsSelected: [] });
  }

  passData = () => {
    const { passData: passDataToParent } = this.props;
    const { firstItem, listing } =  this.getDataBySortingType()
    if (this.state.cursor === 0) {
      const { name, permissions, type } = firstItem;
      passDataToParent(this.state.cursor, name, permissions, type);
    } else {
      const { name, permissions, type } = listing[this.state.cursor - 1];
      passDataToParent(this.state.cursor, name, permissions, type);
    }
  }

  openDirectory = (name) => {
    const { history, path, addToPath, openDirectory } = this.props;

    history.push({
      pathname: '/list/directory/',
      search: `?path=${path}/${name}`
    });
    addToPath(name);
    openDirectory();
    this.setState({ cursor: 0 });
  }

  openCertainDirectory = (path) => {
    const { history, openCertainDirectory, changePath } = this.props;

    if (this.isHomeDirectory()) {
      return;
    }

    history.push({
      pathname: '/list/directory/',
      search: `?path=${path}`
    });
    changePath(path);
    openCertainDirectory();
  }

  changeSorting = (sortingType, orderType) => {
    this.setState({ sortingType, orderType }, () => this.cacheSorting());
  }

  sortByType = (a, b) => {
    if (this.state.orderType === "descending" && a.name !== "") {
      return a.type.localeCompare(b.type);
    } else if (this.state.orderType === "ascending" && b.name !== "") {
      return b.type.localeCompare(a.type);
    }
  }

  sortBySize = (a, b) => {
    if (this.state.orderType === "descending" && a.name !== "") {
      return a.size - b.size;
    } else if (this.state.orderType === "ascending" && b.name !== "") {
      return b.size - a.size;
    }
  }

  sortByDate = (a, b) => {
    if (this.state.orderType === "descending" && a.name !== "") {
      return new Date(a.date) - new Date(b.date);
    } else if (this.state.orderType === "ascending" && a.name !== "") {
      return new Date(b.date) - new Date(a.date);
    }
  }

  sortByName = (a, b) => {
    if (this.state.orderType === "descending" && a.name !== "") {
      return a.name.localeCompare(b.name);
    } else if (this.state.orderType === "ascending" && b.name !== "") {
      return b.name.localeCompare(a.name);
    }
  }

  sortData = (a, b) => {
    switch (this.state.sortingType) {
      case "Type": return this.sortByType(a, b);
      case "Size": return this.sortBySize(a, b);
      case "Date": return this.sortByDate(a, b);
      case "Name": return this.sortByName(a, b);
      default: return this.sortByType(a, b);
    }
  }

  getDataBySortingType = () => {
    let firstItem, listing = [];
    this.props.data.listing.forEach(item => {
      if (item.name === '' && item.type === 'd') {
        firstItem = item
      } else {
        listing.push(item)
      }
    })
    if (this.state.sortingType !== 'Type') {
      listing = [
        ...listing.filter(item => item.type === 'd').sort((a, b) => this.sortByName(a, b)),
        ...listing.filter(item => item.type === 'f').sort((a, b) => this.sortData(a, b))
      ]
    } else {
      listing = listing.sort((a, b) => this.sortData(a, b))
    }
    return { firstItem, listing }
  }

  rows = () => {
    const { isActive, modalVisible, path, download } = this.props;
    const { cursor } = this.state;
    const { listing, firstItem } = this.getDataBySortingType()

    if (listing.length || firstItem) {
      return (
        <>
          <Row
            selectOnClick={(cursor, name, permissions, type) => {
              this.setState({ cursor });
              this.props.passData(cursor, name, permissions, type);
            }}
            openDirectory={this.moveBack}
            modalVisible={modalVisible}
            activeRow={0 === cursor}
            isActiveList={isActive}
            cursor={0}
            data={firstItem}
            path={path} />
          {
            listing.map((item, key) => (
              <Row
                key={key + 1}
                selectOnClick={(cursor, name, permissions, type) => {
                  this.setState({ cursor });
                  this.props.passData(cursor, name, permissions, type);
                }}
                selectMultiple={() => this.addToSelection(item.name)}
                selected={this.isSelected(item.name)}
                openDirectory={this.openDirectory}
                modalVisible={modalVisible}
                activeRow={key + 1 === cursor}
                isActiveList={isActive}
                download={download}
                cursor={key + 1}
                data={item}
                path={path} />
            ))
          }
        </>
      );
    }
  }

  render() {
    const { isActive, path, loading } = this.props;
    return (
      <div className={isActive ? "list active" : "list"} onClick={this.toggleActiveList}>
        <Path className={isActive ? "active-path" : "path"}
          openDirectory={this.openCertainDirectory}
          changeSorting={this.changeSorting}
          sorting={this.state.sortingType}
          order={this.state.orderType}
          isActive={isActive}
          path={path} />
        <div className="list-container">
          <ul>
            {loading && isActive ? <Spinner /> : this.rows()}
          </ul>
        </div>
      </div>
    );
  }
}

export default DirectoryList;
