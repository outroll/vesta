import React, { useEffect, useState } from 'react';
import FileManager from '../FileManager/FileManager';
import { Route, Routes, useNavigate, Navigate } from 'react-router';
import Preview from '../../components/Preview/Preview';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icon from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.scss';
import ControlPanelContent from '../ControlPanelContent/ControlPanelContent';
import WebLogs from '../WebLogs/WebLogs';
import LoginForm from 'src/components/Login/LoginForm';
import { useDispatch, useSelector } from 'react-redux';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = useSelector(state => state.session);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Object.entries(session.i18n).length) {
      dispatch(checkAuthHandler())
        .then(token => {
          setLoading(false);
        }, (error) => {
          console.error(error);
          return navigate('/login');
        });
    }
  }, [dispatch, navigate, session]);

  return (
    <div className="App">
      {
        loading
          ? <Spinner />
          : (
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/reset" element={<ForgotPassword />} />
              <Route
                path="/list/directory/"
                element={<FileManager />} />
              <Route
                path="/list/directory/preview/"
                element={<Preview />} />
              <Route
                path="/list/server/service/"
                element={session.userName ? <ServiceInfo /> : <Navigate to="/login" replace />} />
              <Route
                path="/list/web-log/"
                element={session.userName ? <WebLogs /> : <Navigate to="/login" replace />} />
              <Route
                path="/*"
                element={session.userName ? <ControlPanelContent /> : <Navigate to="/login" replace />} />
            </Routes>
          )
      }
    </div>
  );
}

export default App;
