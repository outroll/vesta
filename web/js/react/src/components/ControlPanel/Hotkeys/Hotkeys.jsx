import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Hotkeys.scss';
import { useSelector } from 'react-redux';

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
            <span className="name">a</span>
            <span className="description">{i18n['Add New object']}</span>
          </li>
          <li>
            <span className="name">Ctrl + Open</span>
            <span className="description">{i18n['Save Form']}</span>
          </li>
          <li>
            <span className="name">Ctrl + Backspace</span>
            <span className="description">{i18n['Cancel saving form']}</span>
          </li>
          <li className="space-top">
            <span className="name">1</span>
            <span className="description">{i18n['Go to USER list']}</span>
          </li>
          <li>
            <span className="name">2</span>
            <span className="description">{i18n['Go to WEB list']}</span>
          </li>
          <li>
            <span className="name">3</span>
            <span className="description">{i18n['Go to DNS list']}</span>
          </li>
          <li>
            <span className="name">4</span>
            <span className="description">{i18n['Go to MAIL list']}</span>
          </li>
          <li>
            <span className="name">5</span>
            <span className="description">{i18n['Go to DB list']}</span>
          </li>
          <li>
            <span className="name">6</span>
            <span className="description">{i18n['Go to CRON list']}</span>
          </li>
          <li>
            <span className="name">7</span>
            <span className="description">{i18n['Go to BACKUP list']}</span>
          </li>
        </ul>
        <ul>
          <li>
            <span className="name">f</span>
            <span className="description">{i18n['Focus on search']}</span>
          </li>
          <li className="space-top">
            <span className="name">h</span>
            <span className="description">{i18n['Display/Close shortcuts']}</span>
          </li>
          <li className="space-top">
            <span className="name">&#8592;</span>
            <span className="description">{i18n['Move backward through top menu']}</span>
          </li>
          <li>
            <span className="name">&#8594;</span>
            <span className="description">{i18n['Move forward through top menu']}</span>
          </li>
          <li>
            <span className="name">Enter</span>
            <span className="description">{i18n['Enter focused element']}</span>
          </li>
          <li className="space-top">
            <span className="name">&#8593;</span>
            <span className="description">{i18n['Move up through elements list']}</span>
          </li>
          <li>
            <span className="name">&#8595;</span>
            <span className="description">{i18n['Move down through elements list']}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Hotkeys;