import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "../../../actions/MainNavigation/mainNavigationActions";
import TextInput from '../../ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import { getCronJobInfo, updateCronJob } from '../../../ControlPanelService/Cron';
import AddItemLayout from '../../ControlPanel/AddItemLayout/AddItemLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../components/Spinner/Spinner';
import Toolbar from '../../MainNav/Toolbar/Toolbar';
import Generator from '../Generator/Generator';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import QS from 'qs';

import './EditCronJob.scss';
import { Helmet } from 'react-helmet';

const EditMail = props => {
  const token = localStorage.getItem("token");
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    data: {},
    errorMessage: '',
    okMessage: '',
    loading: false,
    generatedCronJob: {
      h_min: '*',
      h_hour: '*',
      h_day: '*',
      h_wday: '*',
      h_month: '*'
    }
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { job } = queryParams;

    dispatch(addActiveElement('/list/cron/'));
    dispatch(removeFocusedElement());

    if (job) {
      setState({ ...state, loading: true });

      getCronJobInfo(job)
        .then(response => {
          setState({
            ...state,
            generatedCronJob: {
              ...state.generatedCronJob,
              h_min: response.data.min,
              h_hour: response.data.hour,
              h_day: response.data.day,
              h_wday: response.data.wday,
              h_month: response.data.month
            },
            data: response.data,
            errorMessage: response.data['error_msg'],
            okMessage: response.data['ok_msg'],
            loading: false
          });
        })
        .catch(err => console.error(err));
    }
  }, []);

  const submitFormHandler = event => {
    event.preventDefault();
    let updatedJob = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      updatedJob[name] = value;
    }

    if (Object.keys(updatedJob).length !== 0 && updatedJob.constructor === Object) {
      setState({ ...state, loading: true });

      updateCronJob(updatedJob, state.data.job)
        .then(result => {
          if (result.status === 200) {
            const { error_msg, ok_msg } = result.data;

            if (error_msg) {
              setState({ ...state, errorMessage: error_msg, okMessage: '', loading: false });
            } else if (ok_msg) {
              setState({ ...state, errorMessage: '', okMessage: ok_msg, loading: false });
            } else {
              setState({ ...state, loading: false });
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
    <div className="edit-template edit-cron">
      <Helmet>
        <title>{`Vesta - ${i18n.CRON}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Editing Cron Job']}</div>
        <div className="error">
          <span className="error-message">
            {state.data.errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {state.errorMessage}
          </span>
        </div>
        <div className="success">
          <span className="ok-message">
            {state.okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span dangerouslySetInnerHTML={{ __html: state.okMessage }}></span>
          </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="edit-cron">
            <input type="hidden" name="save" value="save" />
            <input type="hidden" name="token" value={token} />

            <TextInput id="command" name="v_cmd" title={i18n['Command']} value={state.data.cmd} />

            <div className="cron-form-body">

              <div className="body-col-1">
                <TextInput
                  value={state.generatedCronJob.h_min}
                  onChange={changeInput}
                  title={i18n['Minute']}
                  name="v_min"
                  id="h_min" />

                <TextInput
                  value={state.generatedCronJob.h_hour}
                  onChange={changeInput}
                  title={i18n['Hour']}
                  name="v_hour"
                  id="h_hour" />

                <TextInput
                  value={state.generatedCronJob.h_day}
                  onChange={changeInput}
                  title={i18n['Day']}
                  name="v_day"
                  id="h_day" />

                <TextInput
                  value={state.generatedCronJob.h_month}
                  onChange={changeInput}
                  title={i18n['Month']}
                  name="v_month"
                  id="h_month" />

                <TextInput
                  value={state.generatedCronJob.h_wday}
                  title={i18n['Day of week']}
                  onChange={changeInput}
                  name="v_wday"
                  id="h_wday" />
              </div>

              <div className="body-col-2">
                <Generator mode="edit" job={state.data.job} generatedCronJob={saveGeneratedCronJob} />
              </div>

            </div>

            <div className="buttons-wrapper">
              <button type="submit" className="add">{i18n.Save}</button>
              <button type="button" className="back" onClick={() => history.push('/list/cron/')}>{i18n.Back}</button>
            </div>

          </form>
        }
      </AddItemLayout>
    </div>
  );
}

export default EditMail;