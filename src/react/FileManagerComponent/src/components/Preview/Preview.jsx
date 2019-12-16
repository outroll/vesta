import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Editor from './Editor/Editor';
import Photo from './Photo/Photo';
import Video from './Video/Video';

class Preview extends Component {

  componentDidMount = () => {
    document.addEventListener("keydown", this.hotkeys);
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.hotkeys);
  }

  hotkeys = (e) => {
    if (e.keyCode === 121) {
      this.props.onClose();
    }
  }

  content = () => {
    const { location, onClose } = this.props;
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

  render() {
    return (
      <div>
        {this.content()}
      </div>
    );
  }
}

export default withRouter(Preview);