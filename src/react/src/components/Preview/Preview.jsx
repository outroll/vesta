import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import Editor from './Editor/Editor';
import Photo from './Photo/Photo';
import Video from './Video/Video';

const Preview = (props) => {
  const {userName} = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userName) navigate('/login');

    document.addEventListener("keydown", hotkeys);

    return () => {
      document.removeEventListener("keydown", hotkeys);
    }
  }, []);

  const hotkeys = e => {
    if (e.keyCode === 121) {
      onClose();
    }
  }

  const onClose = () => {
    let lastOpenedDirectory = location.search.substring(6, location.search.lastIndexOf('/'));
    navigate({
      pathname: '/list/directory',
      search: `?path=${lastOpenedDirectory}`
    })
  }

  const content = () => {
    let split = location.search.split('/');
    let name = split[split.length - 1];

    if (location.pathname !== '/list/directory/preview/') {
      return;
    }

    if (name.match('.mp4')) {
      return <Video closeModal={onClose} />;
    } else if (name.match(/png|jpg|jpeg|gif/g)) {
      return <Photo closeModal={onClose} close={onClose} path={location.search} activeImage={name} />;
    } else {
      return <Editor close={onClose} name={name} />;
    }
  }

  return (
    <div>
      {content()}
    </div>
  );
}

export default Preview;