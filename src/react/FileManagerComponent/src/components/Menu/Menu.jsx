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
    return (
      <div className="menu">
        <div className="logo">
          <a href={window.location.origin}>
            <img src="../../images/logo.png" alt="Logo" />
          </a>
        </div>
        <div className="btn-group" role="group" aria-label="First group">
          <input type="file" className="upload" multiple onChange={this.upload} ref={inputFile => this.inputFile = inputFile} />
          <button type="button" className="btn btn-light" id="upload" onClick={() => this.inputFile.click()}>{window.GLOBAL.App.Constants.FM_UPLOAD}</button>
          <button type="button" className="btn btn-light big" onClick={this.newFile}>{window.GLOBAL.App.Constants.FM_NEW_FILE}</button>
          <button type="button" className="btn btn-light small" onClick={this.newFile} title={window.GLOBAL.App.Constants.FM_NEW_FILE}><FontAwesomeIcon icon="file" className="icon file" /></button>
          <button type="button" className="btn btn-light big" onClick={this.newDirectory}>{window.GLOBAL.App.Constants.FM_NEW_DIR}</button>
          <button type="button" className="btn btn-light small" onClick={this.newDirectory} title={window.GLOBAL.App.Constants.FM_NEW_DIR}><FontAwesomeIcon icon="folder" className="icon folder-close" /></button>
          <button type="button" className="btn btn-light big" onClick={this.download}>{window.GLOBAL.App.Constants.FM_DOWNLOAD}</button>
          <button type="button" className="btn btn-light small" onClick={this.download} title={window.GLOBAL.App.Constants.FM_DOWNLOAD}><FontAwesomeIcon icon="download" className="icon download" /></button>
          <button type="button" className="btn btn-light big" onClick={this.rename}>{window.GLOBAL.App.Constants.FM_RENAME_BUTTON}</button>
          <button type="button" className="btn btn-light small" onClick={this.rename} title={window.GLOBAL.App.Constants.FM_RENAME_BUTTON}><FontAwesomeIcon icon="italic" className="icon italic" /></button>
          <button type="button" className="btn btn-light big" onClick={this.permissions}>{window.GLOBAL.App.Constants.FM_RIGHTS}</button>
          <button type="button" className="btn btn-light small" onClick={this.permissions} title={window.GLOBAL.App.Constants.FM_RIGHTS}><FontAwesomeIcon icon="user" className="icon user" /></button>
          <button type="button" className="btn btn-light big" onClick={this.copy}>{window.GLOBAL.App.Constants.FM_COPY_BUTTON}</button>
          <button type="button" className="btn btn-light small" onClick={this.copy} title={window.GLOBAL.App.Constants.FM_COPY_BUTTON}><FontAwesomeIcon icon="copy" className="icon copy" /></button>
          <button type="button" className="btn btn-light big" onClick={this.move}>{window.GLOBAL.App.Constants.FM_MOVE_BUTTON}</button>
          <button type="button" className="btn btn-light small" onClick={this.move} title={window.GLOBAL.App.Constants.FM_MOVE_BUTTON}><FontAwesomeIcon icon="paste" className="icon paste" /></button>
          {matchArchive ? null : <button type="button" className="btn btn-light big" onClick={this.archive}>{window.GLOBAL.App.Constants.FM_ARCHIVE}</button>}
          {matchArchive ? null : <button type="button" className="btn btn-light small" onClick={this.archive} title={window.GLOBAL.App.Constants.FM_ARCHIVE}><FontAwesomeIcon icon="book" className="icon book" /></button>}
          {matchArchive ? <button type="button" className="btn btn-light big" onClick={this.extract}>{window.GLOBAL.App.Constants.FM_EXTRACT}</button> : null}
          {matchArchive ? <button type="button" className="btn btn-light small" onClick={this.extract} title={window.GLOBAL.App.Constants.FM_EXTRACT}><FontAwesomeIcon icon="box-open" className="icon open" /></button> : null}
          <button type="button" className="btn btn-light big delete" onClick={this.delete} >{window.GLOBAL.App.Constants.FM_DELETE_BUTTON}</button>
          <button type="button" className="btn btn-light small" onClick={this.delete} title={window.GLOBAL.App.Constants.FM_DELETE_BUTTON}><FontAwesomeIcon icon="trash" className="icon trash" /></button>
        </div>
      </div>
    );
  }
}

export default Menu;