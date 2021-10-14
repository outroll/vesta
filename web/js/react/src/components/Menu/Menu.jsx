import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Menu.scss';

class Menu extends Component {

  componentDidMount = () => {
    document.addEventListener("keydown", this.hotKeys);
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.hotKeys);
  }

  newFile = () => {
    this.props.openModal("Add file");
  }

  newDirectory = () => {
    this.props.openModal("Add directory");
  }

  delete = () => {
    const { selection, openModal, cursor } = this.props;
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal("Nothing selected");
      } else {
        openModal("Delete");
      }
    } else {
      openModal("Delete", selection.length);
    }
  }

  rename = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else {
      this.props.openModal("Rename");
    }
  }

  permissions = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else {
      this.props.openModal("Permissions");
    }
  }

  move = () => {
    const { selection, openModal, cursor } = this.props;
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal("Nothing selected");
      } else {
        openModal("Move");
      }
    } else {
      openModal("Move", selection.length);
    }
  }

  archive = () => {
    const { selection, openModal, cursor } = this.props;

    if (selection.length === 0) {
      if (cursor === 0) {
        openModal("Nothing selected");
      } else {
        openModal("Archive");
      }
    } else {
      openModal("Archive", selection.length);
    }
  }

  extract = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else {
      this.props.openModal("Extract");
    }
  }

  copy = () => {
    const { selection, openModal, cursor } = this.props;
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal("Nothing selected");
      } else {
        openModal("Copy");
      }
    } else {
      openModal("Copy", selection.length);
    }
  }

  upload = (e) => {
    if (e.target.files.length === 0) {
      return;
    }

    this.props.upload(e.target.files);
  }

  download = () => {
    if (this.props.cursor === 0) {
      this.props.openModal("Nothing selected");
    } else if (this.props.itemType === "d") {
      this.props.openModal("Nothing selected", null, true);
    } else {
      this.props.download();
    }
  }

  hotKeys = (e) => {
    if (this.props.modalVisible) {
      return;
    }

    if (e.shiftKey && e.keyCode === 117) {
      this.rename();
    }

    switch (e.keyCode) {
      case 46: return this.delete();
      case 65: return this.archive();
      case 68: return this.download();
      case 77: return this.move();
      case 78: return this.newFile();
      case 85: return this.inputFile.click();
      case 113: return this.rename();
      case 115: return this.permissions();
      case 116: return this.copy();
      case 118: return this.newDirectory();
      case 119: return this.delete();
      default: break;
    }
  }

  render() {
    let matchArchive = this.props.name.match(/.zip|.tgz|.tar.gz|.gzip|.tbz|.tar.bz|.gz|.zip|.tar|.rar/g);
    const { i18n } = window.GLOBAL.App;

    return (
      <div className="menu">
        <div className="logo">
          <a href={window.location.origin}>
            <img src="../../images/logo.png" alt="Logo" />
          </a>
        </div>
        <div className="btn-group" role="group" aria-label="First group">
          <input type="file" className="upload" multiple onChange={this.upload} ref={inputFile => this.inputFile = inputFile} />
          <button type="button" className="btn btn-light" id="upload" onClick={() => this.inputFile.click()}>{i18n.UPLOAD}</button>
          <button type="button" className="btn btn-light big" onClick={this.newFile}>{i18n['NEW FILE']}</button>
          <button type="button" className="btn btn-light small" onClick={this.newFile} title={i18n['NEW FILE']}><FontAwesomeIcon icon="file" className="icon file" /></button>
          <button type="button" className="btn btn-light big" onClick={this.newDirectory}>{i18n['NEW DIR']}</button>
          <button type="button" className="btn btn-light small" onClick={this.newDirectory} title={i18n['NEW DIR']}><FontAwesomeIcon icon="folder" className="icon folder-close" /></button>
          <button type="button" className="btn btn-light big" onClick={this.download}>{i18n.DOWNLOAD}</button>
          <button type="button" className="btn btn-light small" onClick={this.download} title={i18n.DOWNLOAD}><FontAwesomeIcon icon="download" className="icon download" /></button>
          <button type="button" className="btn btn-light big" onClick={this.rename}>{i18n.RENAME}</button>
          <button type="button" className="btn btn-light small" onClick={this.rename} title={i18n.RENAME}><FontAwesomeIcon icon="italic" className="icon italic" /></button>
          <button type="button" className="btn btn-light big" onClick={this.permissions}>{i18n.RIGHTS}</button>
          <button type="button" className="btn btn-light small" onClick={this.permissions} title={i18n.RIGHTS}><FontAwesomeIcon icon="user" className="icon user" /></button>
          <button type="button" className="btn btn-light big" onClick={this.copy}>{i18n.COPY}</button>
          <button type="button" className="btn btn-light small" onClick={this.copy} title={i18n.COPY}><FontAwesomeIcon icon="copy" className="icon copy" /></button>
          <button type="button" className="btn btn-light big" onClick={this.move}>{i18n.MOVE}</button>
          <button type="button" className="btn btn-light small" onClick={this.move} title={i18n.MOVE}><FontAwesomeIcon icon="paste" className="icon paste" /></button>
          {matchArchive ? null : <button type="button" className="btn btn-light big" onClick={this.archive}>{i18n.ARCHIVE}</button>}
          {matchArchive ? null : <button type="button" className="btn btn-light small" onClick={this.archive} title={i18n.ARCHIVE}><FontAwesomeIcon icon="book" className="icon book" /></button>}
          {matchArchive ? <button type="button" className="btn btn-light big" onClick={this.extract}>{i18n.EXTRACT}</button> : null}
          {matchArchive ? <button type="button" className="btn btn-light small" onClick={this.extract} title={i18n.EXTRACT}><FontAwesomeIcon icon="box-open" className="icon open" /></button> : null}
          <button type="button" className="btn btn-light big delete" onClick={this.delete} >{i18n.DELETE}</button>
          <button type="button" className="btn btn-light small" onClick={this.delete} title={i18n.DELETE}><FontAwesomeIcon icon="trash" className="icon trash" /></button>
        </div>
      </div>
    );
  }
}

export default Menu;