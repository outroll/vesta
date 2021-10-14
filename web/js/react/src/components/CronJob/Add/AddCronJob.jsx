import React, { useEffect, useState } from 'react';

import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addCronJob } from '../../../ControlPanelService/Cron';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import Generator from '../Generator/Generator';
import { useHistory } from 'react-router-dom';
import Spinner from '../../Spinner/Spinner';
import { useDispatch } from 'react-redux';

import './AddCronJob.scss';
import { Helmet } from 'react-helmet';

const AddCronJob = props => {
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    okMessage: '',
    errorMessage: '',
    generatedCronJob: {
      h_min: '*',
      h_hour: '*',
      h_day: '*',
      h_wday: '*',
      h_month: '*'
    }
  });

  useEffect(() => {
    dispatch(addActiveElement('/list/cron/'));
    dispatch(removeFocusedElement());
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let newCronJob = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newCronJob[name] = value;
    }

    if (Object.keys(newCronJob).length !== 0 && newCronJob.constructor === Object) {
      setState({ ...state, loading: true });

      addCronJob(newCronJob)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '', loading: false });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg, loading: false });
            } else {
              setState({ ...state, loading: false })
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  const saveGeneratedCronJob = generatedCronJob => {
    setState({
      ...state,
      generatedCronJob
    });
  }

  const changeInput = input => {
    let updatedGeneratedCronJob = {
      ...state.generatedCronJob,
      [input.id]: input.value
    };

    setState({
      ...state,
      generatedCronJob: updatedGeneratedCronJob
    });
  }

  return (
    <div className="edit-template add-cron">
      <Helmet>
        <title>{`Vesta - ${i18n.CRON}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Adding Cron Job']}</div>
        <div className="error">
          <span className="error-message">
            {state.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            {state.errorMessage}</span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''}
            <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout>
        {state.loading ? <Spinner /> : (
          <form onSubmit={event => submitFormHandler(event)}>
            <input type="hidden" name="ok" value="add" />
            <input type="hidden" name="token" value={token} />

            <div className="form-group command">
              <label htmlFor="command">{i18n.Command ?? 'Command'}</label>
              <input
                type="text"
                className="form-control"
                id="command"
                name="v_cmd" />
            </div>

            <div className="cron-form-body">

              <div className="body-col-1">
                <div className="form-group">
                  <label htmlFor="h_min">{i18n.Minute ?? 'Minute'}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="h_min"
                    onChange={event => changeInput(event.target)}
                    value={state.generatedCronJob.h_min}
                    name="v_min" />
                </div>

                <div className="form-group">
                  <label htmlFor="h_hour">{i18n.Hour ?? 'Hour'}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="h_hour"
                    onChange={event => changeInput(event.target)}
                    value={state.generatedCronJob.h_hour}
                    name="v_hour" />
                </div>

                <div className="form-group">
                  <label htmlFor="h_day">{i18n.Day ?? 'Day'}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="h_day"
                    onChange={event => changeInput(event.target)}
                    value={state.generatedCronJob.h_day}
                    name="v_day" />
                </div>

                <div className="form-group">
                  <label htmlFor="h_month">{i18n.Month ?? 'Month'}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="h_month"
                    onChange={event => changeInput(event.target)}
                    value={state.generatedCronJob.h_month}
                    name="v_month" />
                </div>

                <div className="form-group">
                  <label htmlFor="h_wday">{i18n['Day of week'] ?? 'Days of week'}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="h_wday"
                    onChange={event => changeInput(event.target)}
                    value={state.generatedCronJob.h_wday}
                    name="v_wday" />
                </div>
              </div>

              <div className="body-col-2">
                <Generator mode="add" generatedCronJob={saveGeneratedCronJob} />
              </div>

            </div>

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Add ?? 'Add'}</button>
              <button type="button" className="back" onClick={() => history.push('/list/cron/')}>{i18n.Back ?? 'Back'}</button>
            </div>
          </form>
        )}
      </AddItemLayout>
    </div>
  );
}

export default AddCronJob;