import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../Spinner/Spinner';
import Path from '../../Path/Path';
import Row from '../Row/Row';
import '../List.scss';

class DirectoryList extends Component {
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

  state = {
    orderType: "descending",
    sortingType: "Type",
    itemsSelected: [],
    cursor: 0
  };

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
    return this.props.path === window.GLOBAL.ROOT_DIR;
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
    const { data, isActive, modalVisible, changePath, path } = this.props;
    const { cursor } = this.state;

    if (!isActive || modalVisible) {
      return;
    }

    if (e.keyCode === 40) {
      if (cursor === data.listing.length - 1) {
        return;
      }

      if (e.shiftKey) {
        let name = data.listing[cursor].name;
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
        let name = data.listing[cursor].name;
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
    const { data, passData } = this.props;
    const { name, permissions, type } = data.listing[this.state.cursor];
    passData(this.state.cursor, name, permissions, type);
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
      case "Size": if (a.type !== "d" && b.type !== "d") { return this.sortBySize(a, b) }; break;
      case "Date": return this.sortByDate(a, b);
      case "Name": return this.sortByName(a, b);
      default: return this.sortByType(a, b);
    }
  }

  rows = () => {
    const { isActive, modalVisible, path, download } = this.props;
    const { cursor } = this.state;
    const data = { ...this.props.data };

    if (data.listing.length !== 0) {
      let sortedData = data.listing.sort((a, b) => this.sortData(a, b));
      return (
        sortedData.map((item, key) =>
          (item.name !== "" && sortedData.length !== 0) ?
            (<Row key={key}
              selectOnClick={(cursor, name, permissions, type) => {
                this.setState({ cursor });
                this.props.passData(cursor, name, permissions, type);
              }}
              selectMultiple={() => this.addToSelection(item.name)}
              selected={this.isSelected(item.name)}
              openDirectory={this.openDirectory}
              modalVisible={modalVisible}
              activeRow={key === cursor}
              isActiveList={isActive}
              download={download}
              cursor={key}
              data={item}
              path={path} />) :
            (<Row key={key}
              selectOnClick={(cursor, name, permissions, type) => {
                this.setState({ cursor });
                this.props.passData(cursor, name, permissions, type);
              }}
              openDirectory={this.moveBack}
              modalVisible={modalVisible}
              activeRow={key === cursor}
              isActiveList={isActive}
              cursor={key}
              data={item}
              path={path} />))
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
