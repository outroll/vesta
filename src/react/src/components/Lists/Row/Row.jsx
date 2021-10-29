import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJs, faCss3, faPhp, faHtml5, faSass } from '@fortawesome/free-brands-svg-icons';
import './Row.scss';
import { connect } from 'react-redux';

class Row extends Component {
  static propTypes = {
    selectMultiple: PropTypes.func,
    selectOnClick: PropTypes.func,
    openDirectory: PropTypes.func,
    modalVisible: PropTypes.bool,
    isActiveList: PropTypes.bool,
    activeRow: PropTypes.bool,
    selected: PropTypes.func,
    download: PropTypes.func,
    cursor: PropTypes.number,
    path: PropTypes.string,
    key: PropTypes.number,
    data: PropTypes.array
  }

  componentDidMount = () => {
    document.addEventListener("keydown", this.openOnEnter);
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.openOnEnter);
  }

  openOnEnter = (e) => {
    const { activeRow, data: { name, type }, isActiveList, modalVisible, openDirectory, cursor, download, path } = this.props;

    if (modalVisible || !activeRow || !isActiveList) {
      return;
    }

    if (e.keyCode === 13) {
      if (this.isArchive(name) || type === "l") {
        download();
      } else if (this.isFile(type) && cursor !== 0) {
        this.changePath(path, name);
      } else {
        openDirectory(name);
      }
    }
  }

  openItem = () => {
    const { data: { type, name }, openDirectory, download, path, isActiveList } = this.props;

    if (!isActiveList) {
      return;
    }

    if (this.isArchive(name) || type === "l" || name.match('.mp4')) {
      return download();
    } else if (this.isFile(type)) {
      return this.changePath(path, name);
    } else if (type === 'd') {
      return openDirectory(name);
    }
  }

  changePath = (path, name) => {
    this.props.history.push({
      pathname: '/list/directory/preview/',
      search: `?path=${path}/${name}`
    });
  }

  selectRow = (e) => {
    const { data: { name, permissions, type }, selectMultiple, selectOnClick, cursor, activeRow } = this.props;

    if (e.ctrlKey && cursor !== 0) {
      selectMultiple();
    }

    if (activeRow) {
      return;
    }

    selectOnClick(cursor, name, permissions, type);
  }

  className = () => {
    const { activeRow, selected, isActiveList } = this.props;

    if (isActiveList) {
      let isActive = activeRow ? 'active' : '';
      let isSelected = selected ? 'selected' : '';
      return isActive.length ? isActive : isSelected;
    } else {
      let isActive = activeRow ? 'inactive' : '';
      let isSelected = selected ? 'inactive-selected' : '';
      return isActive.length ? isActive : isSelected;
    }
  }

  sizeFormatter = (bytes, decimals) => {
    if (bytes === undefined || this.props.data.type === "d") {
      return null;
    };

    if (bytes === "0") {
      return <span className="value">0 <span className="unit">b</span></span>;
    }

    let k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['b', 'kb', 'Mb', 'GB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return (<span className="value">{parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} <span className="unit">{sizes[i]}</span></span>);
  }

  dateFormatter = (fDate) => {
    if (fDate === undefined) {
      return null;
    }

    let date = new Date(fDate),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      getDay = date.getDate(),
      getMonth = this.props.session.i18n[months[date.getMonth()]];
    return (<span className="date">{getMonth} {getDay}</span>);
  }

  glyph = () => {
    const { data: { type, name } } = this.props;

    if (type === 'd') {
      return <FontAwesomeIcon icon="folder-open" className="folder-open" />;
    }

    if (this.isFile(type)) {
      if (this.isArchive(name)) {
        return <FontAwesomeIcon icon="book" className="archive" />;
      } else if (name.match(/png|jpg|jpeg|gif/g)) {
        return <FontAwesomeIcon icon="image" className="image" />;
      } else if (name.match('.mp4') !== null) {
        return <FontAwesomeIcon icon="download" className="download" />;
      } else if (name.match('.txt')) {
        return <FontAwesomeIcon icon="file-alt" className="file-alt" />;
      } else if (name.match('.js')) {
        return <FontAwesomeIcon icon={faJs} className="js" />;
      } else if (name.match('.html')) {
        return <FontAwesomeIcon icon={faHtml5} className="html5" />;
      } else if (name.match('.php')) {
        return <FontAwesomeIcon icon={faPhp} className="php" />;
      } else if (name.match(/.scss/i)) {
        return <FontAwesomeIcon icon={faSass} className="sass" />;
      } else if (name.match(/.css/i)) {
        return <FontAwesomeIcon icon={faCss3} className="css3" />;
      } else {
        return <FontAwesomeIcon icon="file" className="file" />;
      }
    }

    if (type === "l") {
      return <FontAwesomeIcon icon="download" className="download" />;
    }
  }

  isArchive(name) {
    return name.match(/zip|tgz|tar.gz|gzip|tbz|tar.bz|gz|zip|tar|rar/g);
  }

  isFile(type) {
    return type === 'f';
  }

  render() {
    const { data: { name, owner, permissions, size, date, time } } = this.props;
    return (
      <li className={this.className()} onClick={this.selectRow} >
        <span className="marker"></span>
        {this.glyph()}
        <span className="fName"><span className="name" onClick={(e) => this.openItem(e)}>{this.props.cursor === 0 ? ".." : name}</span></span>
        <span className="fPermissions">{permissions}</span>
        <span className="fOwner">{owner}</span>
        <span className="fSize">{this.sizeFormatter(size)}</span>
        <span className="fDate">{this.dateFormatter(date)}</span>
        <span className="fTime">{time}</span>
      </li>
    );
  }
}

function mapStateToProps(state) {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(withRouter(Row));
