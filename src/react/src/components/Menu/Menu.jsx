import React, { useCallback, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Menu.scss'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Menu = (props) => {
  const { i18n } = useSelector((state) => state.session)
  const inputFile = useRef()

  const handleUserKeyDown = useCallback((event) => hotKeys(event), [props])

  useEffect(() => {
    document.addEventListener('keydown', handleUserKeyDown)

    return () => document.removeEventListener('keydown', handleUserKeyDown)
  }, [handleUserKeyDown])

  const newFile = () => {
    props.openModal('Add file')
  }

  const newDirectory = () => {
    props.openModal('Add directory')
  }

  const deleteFile = () => {
    const { selection, openModal, cursor } = props
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal('Nothing selected')
      } else {
        openModal('Delete')
      }
    } else {
      openModal('Delete', selection.length)
    }
  }

  const rename = () => {
    console.log(props)
    if (props.cursor === 0) {
      props.openModal('Nothing selected')
    } else {
      props.openModal('Rename')
    }
  }

  const permissions = () => {
    if (props.cursor === 0) {
      props.openModal('Nothing selected')
    } else {
      props.openModal('Permissions')
    }
  }

  const move = () => {
    const { selection, openModal, cursor } = props
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal('Nothing selected')
      } else {
        openModal('Move')
      }
    } else {
      openModal('Move', selection.length)
    }
  }

  const archive = () => {
    const { selection, openModal, cursor } = props

    if (selection.length === 0) {
      if (cursor === 0) {
        openModal('Nothing selected')
      } else {
        openModal('Archive')
      }
    } else {
      openModal('Archive', selection.length)
    }
  }

  const extract = () => {
    if (props.cursor === 0) {
      props.openModal('Nothing selected')
    } else {
      props.openModal('Extract')
    }
  }

  const copy = () => {
    const { selection, openModal, cursor } = props
    if (selection.length === 0) {
      if (cursor === 0) {
        openModal('Nothing selected')
      } else {
        openModal('Copy')
      }
    } else {
      openModal('Copy', selection.length)
    }
  }

  const upload = (e) => {
    if (e.target.files.length === 0) {
      return
    }

    props.upload(e.target.files)
  }

  const download = () => {
    if (props.cursor === 0) {
      props.openModal('Nothing selected')
    } else if (props.itemType === 'd') {
      props.openModal('Nothing selected', null, true)
    } else {
      props.download()
    }
  }

  const hotKeys = (e) => {
    e.stopPropagation()
    e.preventDefault()
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus')

    if (props.modalVisible || isSearchInputFocused) return

    if (e.shiftKey && e.keyCode === 118) {
      rename()
      return
    }

    switch (e.keyCode) {
      // u
      case 85:
        return inputFile.current.click()
      // n
      case 78:
        return newFile()
      // F6
      case 118:
        return newDirectory()
      // d
      case 68:
        return download()
      // F2
      case 113:
        return rename()
      // m
      case 77:
        return move()
      // F4
      case 115:
        return copy()
      // a
      case 65:
        return archive()
      // F8
      case 119:
        return deleteFile()
      // Del
      case 46:
        return deleteFile()
      // F3
      case 114:
        return permissions()
      default:
        break
    }
  }

  let matchArchive = props.name.match(/.zip|.tgz|.tar.gz|.gzip|.tbz|.tar.bz|.gz|.zip|.tar|.rar/g)

  return (
    <div className="menu">
      <div className="logo">
        <Link to="/">
          <img src="../../images/logo.png" alt="Logo" />
        </Link>
      </div>
      <div className="btn-group" role="group" aria-label="First group">
        <input type="file" className="upload" multiple onChange={upload} ref={inputFile} />
        <button type="button" className="btn btn-light" id="upload" onClick={() => inputFile.current.click()}>
          {i18n.UPLOAD}
        </button>
        <button type="button" className="btn btn-light big" onClick={newFile}>
          {i18n['NEW FILE']}
        </button>
        <button type="button" className="btn btn-light small" onClick={newFile} title={i18n['NEW FILE']}>
          <FontAwesomeIcon icon="file" className="icon file" />
        </button>
        <button type="button" className="btn btn-light big" onClick={newDirectory}>
          {i18n['NEW DIR']}
        </button>
        <button type="button" className="btn btn-light small" onClick={newDirectory} title={i18n['NEW DIR']}>
          <FontAwesomeIcon icon="folder" className="icon folder-close" />
        </button>
        <button type="button" className="btn btn-light big" onClick={download}>
          {i18n.DOWNLOAD}
        </button>
        <button type="button" className="btn btn-light small" onClick={download} title={i18n.DOWNLOAD}>
          <FontAwesomeIcon icon="download" className="icon download" />
        </button>
        <button type="button" className="btn btn-light big" onClick={rename}>
          {i18n.RENAME}
        </button>
        <button type="button" className="btn btn-light small" onClick={rename} title={i18n.RENAME}>
          <FontAwesomeIcon icon="italic" className="icon italic" />
        </button>
        <button type="button" className="btn btn-light big" onClick={permissions}>
          {i18n.RIGHTS}
        </button>
        <button type="button" className="btn btn-light small" onClick={permissions} title={i18n.RIGHTS}>
          <FontAwesomeIcon icon="user" className="icon user" />
        </button>
        <button type="button" className="btn btn-light big" onClick={copy}>
          {i18n.COPY}
        </button>
        <button type="button" className="btn btn-light small" onClick={copy} title={i18n.COPY}>
          <FontAwesomeIcon icon="copy" className="icon copy" />
        </button>
        <button type="button" className="btn btn-light big" onClick={move}>
          {i18n.MOVE}
        </button>
        <button type="button" className="btn btn-light small" onClick={move} title={i18n.MOVE}>
          <FontAwesomeIcon icon="paste" className="icon paste" />
        </button>
        {matchArchive ? null : (
          <button type="button" className="btn btn-light big" onClick={archive}>
            {i18n.ARCHIVE}
          </button>
        )}
        {matchArchive ? null : (
          <button type="button" className="btn btn-light small" onClick={archive} title={i18n.ARCHIVE}>
            <FontAwesomeIcon icon="book" className="icon book" />
          </button>
        )}
        {matchArchive ? (
          <button type="button" className="btn btn-light big" onClick={extract}>
            {i18n.EXTRACT}
          </button>
        ) : null}
        {matchArchive ? (
          <button type="button" className="btn btn-light small" onClick={extract} title={i18n.EXTRACT}>
            <FontAwesomeIcon icon="box-open" className="icon open" />
          </button>
        ) : null}
        <button type="button" className="btn btn-light big delete" onClick={deleteFile}>
          {i18n.DELETE}
        </button>
        <button type="button" className="btn btn-light small" onClick={deleteFile} title={i18n.DELETE}>
          <FontAwesomeIcon icon="trash" className="icon trash" />
        </button>
      </div>
    </div>
  )
}

export default Menu
