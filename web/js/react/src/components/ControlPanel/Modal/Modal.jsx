import React from 'react';
import { useSelector } from 'react-redux';
import './Modal.scss';

const Modal = ({ show, text, onSave, onCancel, showSaveButton = true, showCancelButton = true }) => {
  const { i18n } = useSelector(state => state.session);

  return (
    <div>
      <div className={`modal fade ${show ? 'show' : ''}`} id="c-panel-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: show ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{i18n.Confirmation}</h5>
              <button type="button" onClick={() => onCancel()} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {text}
            </div>
            <div className="modal-footer">
              {showCancelButton ? <button onClick={() => onCancel()} type="button" className="btn btn-secondary" data-dismiss="modal">{i18n.Cancel}</button> : ''}
              {showSaveButton ? <button onClick={() => onSave()} type="button" className="btn btn-primary">{i18n.OK}</button> : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Modal;
