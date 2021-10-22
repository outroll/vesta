import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import './Hotkeys.scss';

const Hotkeys = props => {
  const { i18n } = useSelector(state => state.session);

  useEffect(() => {
    window.addEventListener("keyup", toggleShortcutsLit);

    return () => window.removeEventListener("keyup", toggleShortcutsLit);
  }, [props.reference]);

  const toggleShortcutsLit = event => {
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (event.keyCode === 72 && !isSearchInputFocused) {
      props.toggleHotkeys();
    }
  }

  return (
    <div className="hotkeys-list hide" ref={props.reference}>
      <div className="head">
        <div className="name">{i18n.Shortcuts}</div>
        <div className="close" onClick={() => props.toggleHotkeys()}><FontAwesomeIcon icon="times" /></div>
      </div>
      <div className="body">
        <ul>
          <li>
            <span className="name">u</span>
            <span className="description">{i18n['Upload']}</span>
          </li>
          <li>
            <span className="name">n</span>
            <span className="description">{i18n['New Fille']}</span>
          </li>
          <li>
            <span className="name">F7</span>
            <span className="description">{i18n['New Folder']}</span>
          </li>
          <li>
            <span className="name">d</span>
            <span className="description">{i18n['Download']}</span>
          </li>
          <li className="space-top">
            <span className="name">F2 / Shift + F6</span>
            <span className="description">{i18n['Rename']}</span>
          </li>
          <li>
            <span className="name">m</span>
            <span className="description">{i18n['Move']}</span>
          </li>
          <li>
            <span className="name">F5</span>
            <span className="description">{i18n['Copy']}</span>
          </li>
          <li>
            <span className="name">F5</span>
            <span className="description">{i18n['Copy']}</span>
          </li>
          <li>
            <span className="name">F8 / Del</span>
            <span className="description">{i18n['Delete']}</span>
          </li>
          <li>
            <span className="name">F2</span>
            <span className="description">{i18n['Save File (in text editor)']}</span>
          </li>
          <li>
            <span className="name">h</span>
            <span className="description">{i18n['Display/Close shortcuts']}</span>
          </li>
          <li>
            <span className="name">Esc</span>
            <span className="description">{i18n['Close Popup / Cancel']}</span>
          </li>
          <li>
            <span className="name">F10</span>
            <span className="description">{i18n['Close Preview / Editor']}</span>
          </li>
        </ul>
        <ul>
          <li>
            <span className="name">&#8593;</span>
            <span className="description">{i18n['Move Cursor Up']}</span>
          </li>
          <li>
            <span className="name">&#8595;</span>
            <span className="description">{i18n['Move Cursor Down']}</span>
          </li>
          <li>
            <span className="name">&#8592;</span>
            <span className="description">{i18n['Switch to Left Tab']}</span>
          </li>
          <li>
            <span className="name">&#8594;</span>
            <span className="description">{i18n['Switch to Right Tab']}</span>
          </li>
          <li>
            <span className="name">a</span>
            <span className="description">{i18n['Archive']}</span>
          </li>
          <li>
            <span className="name">Enter</span>
            <span className="description">{i18n['Open File / Enter Directory']}</span>
          </li>
          <li>
            <span className="name">F4</span>
            <span className="description">{i18n['Edit File']}</span>
          </li>
          <li>
            <span className="name">Backspace</span>
            <span className="description">{i18n['Go to Parent Directory']}</span>
          </li>
          <li>
            <span className="name">Ctr + Click</span>
            <span className="description">{i18n['Add File to the Current Selection']}</span>
          </li>
          <li>
            <span className="name">Shift + Cursor up/down</span>
            <span className="description">{i18n['Select Bunch of Files']}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Hotkeys;
