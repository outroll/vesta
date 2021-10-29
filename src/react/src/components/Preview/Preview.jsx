import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Editor from './Editor/Editor';
import Photo from './Photo/Photo';
import Video from './Video/Video';

const Preview = (props) => {
  const session = useSelector(state => state.session);
  const history = useHistory();

  useEffect(() => {
    if (!session.userName) history.push('/login');

    document.addEventListener("keydown", hotkeys);

    return () => {
      document.removeEventListener("keydown", hotkeys);
    }
  }, []);

  const hotkeys = e => {
    if (e.keyCode === 121) {
      props.onClose();
    }
  }

  const onClose = () => {
    let lastOpenedDirectory = history.location.search.substring(6, history.location.search.lastIndexOf('/'));
    history.push({
      pathname: '/list/directory',
      search: `?path=${lastOpenedDirectory}`
    })
  }

  const content = () => {
    let split = history.location.search.split('/');
    let name = split[split.length - 1];

    if (history.location.pathname !== '/list/directory/preview/') {
      return;
    }

    if (name.match('.mp4')) {
      return <Video closeModal={onClose} />;
    } else if (name.match(/png|jpg|jpeg|gif/g)) {
      return <Photo closeModal={onClose} close={onClose} path={history.location.search} activeImage={name} />;
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