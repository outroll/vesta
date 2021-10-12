import React from 'react';
import './Hotkeys.scss'

function style(style) {
  if (style === "inactive") {
    return "none";
  } else {
    return "block";
  }
}

const Hotkeys = (props) => {
  const { i18n } = window.GLOBAL.App;

  return (
    <div className="panel panel-default" style={{ display: style(props.style) }}>
      <div className="panel-heading">
        <h2>Shortcuts</h2>
        <button type="button" className="close" onClick={props.close} >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="panel-body">
        <ul>
          <li><span className="shortcut">u</span> {i18n.Upload}</li>
          <li><span className="shortcut">n</span> {i18n['New File']}</li>
          <li><span className="shortcut">F7</span> {i18n['New Folder']}</li>
          <li><span className="shortcut">d</span> {i18n.Download}</li>
          <li><span className="shortcut">F2 / Shift + F6</span> {i18n.Rename}</li>
          <li><span className="shortcut">m</span> {i18n.Move}</li>
          <li><span className="shortcut">F5</span> {i18n.Copy}</li>
          <li><span className="shortcut">F8 / Del</span> {i18n.Delete}</li>
          <li><span className="shortcut">F2</span> {i18n['Save File (in text editor)']}</li>
          <li><span className="shortcut">h</span> {i18n[['Display/Close shortcuts']]}</li>
          <li><span className="shortcut">Esc</span> {i18n['Close Popup / Cancel']}</li>
          <li><span className="shortcut">F10</span> Close Preview / Editor</li>
        </ul>
        <ul>
          <li><span className="shortcut">&#8593;</span> {i18n['Move Cursor Up']}</li>
          <li><span className="shortcut">&#8595;</span> {i18n['Move Cursor Down']}</li>
          <li><span className="shortcut">&#8592;</span> {i18n['Switch to Left Tab']}</li>
          <li><span className="shortcut">&#8594;</span> {i18n['Switch to Right Tab']}</li>
          <li><span className="shortcut">a</span> {i18n.Archive}</li>
          <li><span className="shortcut">Tab</span> {i18n['Switch Tab']}</li>
          <li><span className="shortcut">Enter</span> {i18n['Open File / Enter Directory']}</li>
          <li><span className="shortcut">F4</span>{i18n['Edit File']}</li>
          <li><span className="shortcut">Backspace</span> {i18n['Go to Parent Directory']}</li>
          <li><span className="shortcut">Ctr + Click</span> {i18n['Add File to the Current Selection']}</li>
          <li><span className="shortcut">Shift + Cursor up/down</span> {i18n['Select Bunch of Files']}</li>
        </ul>
      </div>
    </div>
  );
}

export default Hotkeys;