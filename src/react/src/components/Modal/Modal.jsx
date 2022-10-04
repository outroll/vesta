import React, { useEffect } from 'react';
import AddFile from './AddFile';
import AddDirectory from './AddDirectory';
import Rename from './Rename';
import Delete from './Delete';
import NothingSelected from './NothingSelected';
import Permissions from './Permissions';
import Move from './Move';
import Archive from './Archive';
import Extract from './Extract';
import Copy from './Copy';
import Replace from './Replace';
import './Modal.scss';

const Modal = (props) => {
  useEffect(() => {
    window.addEventListener("click", closeOutside);
    document.addEventListener("keydown", hotkeys);

    return () => {
      window.removeEventListener("click", closeOutside);
      document.removeEventListener("keydown", hotkeys);
    }
  }, [])

  const hotkeys = (e) => {
    if (e.keyCode === 27) {
      closeModal();
    } else if (e.keyCode === 13) {
      saveAndClose();
    }
  }

  const saveAndClose = () => {
    props.onClick();
    props.onClose();
  }

  const changePermissions = (permissions) => {
    props.onChangePermissions(permissions);
  }

  const replace = (file) => {
    props.onClick(file);
    props.onClose();
  }

  const onChange = (e) => {
    props.onChangeValue(e.target.value);
  }

  const closeModal = () => {
    props.onClose();
  }

  const closeOutside = (e) => {
    let modal = document.getElementById("modal");
    if (e.target === modal) {
      props.onClose();
    }
  }

  const content = () => {
    const { type, reference, fName, permissions, items, path, files, notAvailable } = props;
    switch (type) {
      case 'Copy': return <Copy close={closeModal} save={saveAndClose} reference={reference} onChange={onChange} name={type} fName={fName} items={items} path={path} />;
      case 'Move': return <Move close={closeModal} save={saveAndClose} reference={reference} onChange={onChange} name={type} fName={fName} items={items} path={path} />;
      case 'Permissions': return <Permissions close={closeModal} save={saveAndClose} changePermissions={changePermissions} fName={fName} permissions={permissions} />;
      case 'Extract': return <Extract close={closeModal} save={saveAndClose} reference={reference} onChange={onChange} name={type} fName={fName} path={path} />;
      case 'Archive': return <Archive close={closeModal} save={saveAndClose} reference={reference} onChange={onChange} items={items} name={type} fName={fName} path={path} />;
      case 'Rename': return <Rename close={closeModal} save={saveAndClose} reference={reference} onChange={onChange} name={type} fName={fName} />;
      case 'Add directory': return <AddDirectory close={closeModal} save={saveAndClose} reference={reference} />;
      case 'Delete': return <Delete close={closeModal} save={saveAndClose} fName={fName} items={items} />;
      case 'Add file': return <AddFile close={closeModal} save={saveAndClose} reference={reference} />;
      case 'Replace': return <Replace close={closeModal} replace={(files) => replace(files)} files={files} />
      case 'Nothing selected': return <NothingSelected close={closeModal} notAvailable={notAvailable} />;
      default:
        break;
    }
  }

  return (
    <div>
      <div className="modal" id="modal">
        {content()}
      </div>
    </div>
  );
}

export default Modal;