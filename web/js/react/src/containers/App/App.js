import React, { useEffect, useState } from 'react';
import FileManager from '../FileManager/FileManager';
import { Route, Switch, useHistory, Redirect } from "react-router";
import Preview from '../../components/Preview/Preview';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icon from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min';
import './App.scss';
import ControlPanelContent from '../ControlPanelContent/ControlPanelContent';
import WebLogs from '../WebLogs/WebLogs';
import LoginForm from 'src/components/Login/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken } from 'src/utils/token';
import { checkAuthHandler } from 'src/actions/Session/sessionActions';
import ServiceInfo from 'src/containers/ServiceInfo';
import ForgotPassword from 'src/components/ForgotPassword';
import Spinner from 'src/components/Spinner/Spinner';

library.add(
  Icon.faBook,
  Icon.faDownload,
  Icon.faFile,
  Icon.faFileAlt,
  Icon.faFolderOpen,
  Icon.faImage,
  Icon.faEllipsisH,
  Icon.faFolder,
  Icon.faItalic,
  Icon.faUser,
  Icon.faCopy,
  Icon.faPaste,
  Icon.faTrash,
  Icon.faBoxOpen,
  Icon.faArrowDown,
  Icon.faArrowUp,
  Icon.faBell,
  Icon.faPlus,
  Icon.faAngleRight,
  Icon.faStar,
  Icon.faUserLock,
  Icon.faPen,
  Icon.faLock,
  Icon.faTimes,
  Icon.faSearch,
  Icon.faCog,
  Icon.faList,
  Icon.faWrench,
  Icon.faFileDownload,
  Icon.faPause,
  Icon.faPlay,
  Icon.faCogs,
  Icon.faStop,
  Icon.faUnlock,
  Icon.faLongArrowAltUp,
  Icon.faEye,
  Icon.faEyeSlash,
  Icon.faLongArrowAltRight,
  Icon.faCaretDown,
  Icon.faCaretUp,
  Icon.faInfinity,
  Icon.faPlay
);

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Object.entries(session.i18n).length) {
      dispatch(checkAuthHandler()).then(token => {
        setLoading(false);
      });
    }
  }, [dispatch, history, session]);

  const AuthenticatedRoute = ({ authenticated, ...rest }) => {
    return (
      <Route {...rest} render={props =>
        authenticated
          ? <rest.component {...props} />
          : <Redirect to="/login" />} />
    );
  }

  return (
    <div className="App">
      {
        loading
          ? <Spinner />
          : (
            <Switch>
              <Route path="/login" exact component={LoginForm} />
              <Route path="/reset" exact component={ForgotPassword} />
              <Route
                path="/list/directory/"
                exact
                component={FileManager} />
              <Route
                path="/list/directory/preview/"
                exact
                component={Preview} />
              <AuthenticatedRoute
                path="/list/server/:service"
                authenticated={session.userName}
                component={ServiceInfo} />
              <AuthenticatedRoute
                path="/list/web-log/"
                exact
                authenticated={session.userName}
                component={WebLogs} />
              <AuthenticatedRoute
                path="/"
                authenticated={session.userName}
                loading={loading}
                component={ControlPanelContent} />
            </Switch>
          )
      }
    </div>
  );
}

export default App;
