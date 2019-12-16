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
          <li><span className="shortcut">u</span> {window.GLOBAL.App.Constants.FM_Upload}</li>
          <li><span className="shortcut">n</span> {window.GLOBAL.App.Constants.FM_NewFile}</li>
          <li><span className="shortcut">F7</span> {window.GLOBAL.App.Constants.FM_NewFolder}</li>
          <li><span className="shortcut">d</span> {window.GLOBAL.App.Constants.FM_Download}</li>
          <li><span className="shortcut">F2 / Shift + F6</span> {window.GLOBAL.App.Constants.FM_Rename}</li>
          <li><span className="shortcut">m</span> {window.GLOBAL.App.Constants.FM_Move}</li>
          <li><span className="shortcut">F5</span> {window.GLOBAL.App.Constants.FM_Copy}</li>
          <li><span className="shortcut">F8 / Del</span> {window.GLOBAL.App.Constants.FM_Delete}</li>
          <li><span className="shortcut">F2</span> {window.GLOBAL.App.Constants.FM_SaveFile}</li>
          <li><span className="shortcut">h</span> {window.GLOBAL.App.Constants.FM_DisplayClose}</li>
          <li><span className="shortcut">Esc</span> {window.GLOBAL.App.Constants.FM_Close}</li>
          <li><span className="shortcut">F10</span> Close Preview / Editor</li>
        </ul>
        <ul>
          <li><span className="shortcut">&#8593;</span> {window.GLOBAL.App.Constants.FM_MoveUp}</li>
          <li><span className="shortcut">&#8595;</span> {window.GLOBAL.App.Constants.FM_MoveDown}</li>
          <li><span className="shortcut">&#8592;</span> {window.GLOBAL.App.Constants.FM_MoveLeft}</li>
          <li><span className="shortcut">&#8594;</span> {window.GLOBAL.App.Constants.FM_MoveRight}</li>
          <li><span className="shortcut">a</span> {window.GLOBAL.App.Constants.FM_Archive}</li>
          <li><span className="shortcut">Tab</span> {window.GLOBAL.App.Constants.FM_Switch}</li>
          <li><span className="shortcut">Enter</span> {window.GLOBAL.App.Constants.FM_Open}</li>
          <li><span className="shortcut">F4</span> Edit file permissions</li>
          <li><span className="shortcut">Backspace</span> {window.GLOBAL.App.Constants.FM_GoBack}</li>
          <li><span className="shortcut">Ctr + Click</span> {window.GLOBAL.App.Constants.FM_SelectBunch}</li>
          <li><span className="shortcut">Shift + Cursor up/down</span> {window.GLOBAL.App.Constants.FM_AddToSelection}</li>
        </ul>
      </div>
    </div>
  );
}

export default Hotkeys;