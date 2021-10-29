import React, { useEffect, useState } from 'react';
import CodeMirror from 'react-codemirror';
import './Editor.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/php/php';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import axios from 'axios';
import Spinner from '../../Spinner/Spinner';
import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const Editor = ({ close, name }) => {
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const [state, setState] = useState({
    code: '',
    loading: false
  });

  useEffect(() => {
    document.addEventListener("keydown", hotKey);

    let path = `${history.location.search.substring(6, history.location.search.lastIndexOf('/'))}/${name}`;
    setState({ ...state, loading: true });

    checkFileType(path)
      .then(res => {
        if (res.data.result) {
          axios.get(`${window.location.origin}/api/v1/edit/file/?path=${encodePath(path)}`)
            .then(result => {
              if (result.data.error) {
                return showToast(res.data.error);
              }

              setState({ ...state, code: result.data.content, loading: false });
            })
            .catch(err => console.error(err));
        } else {
          console.error('Something went wrong with file type!');
        }
      })
      .catch(err => console.error(err));

    return () => {
      document.removeEventListener("keydown", hotKey);
    }
  }, []);

  const checkFileType = path => {
    return axios.get(`${window.location.origin}/file_manager/fm_api.php?dir=${path}&action=check_file_type`);
  }

  const encodePath = path => {
    return path.split('/').join('%2F');
  }

  const hotKey = e => {
    if (e.keyCode === 113) {
      save();
    }
  }

  const save = () => {
    let formData = new FormData();
    let path = history.location.search.substring(6, history.location.search.lastIndexOf('/'));

    formData.append('save', 'Save');
    formData.append('contents', state.code);

    setState({ ...state, loading: true });
    axios.post(`${window.location.origin}/api/v1/edit/file/?path=${path}%2F${name}`, formData)
      .then(res => {
        if (res.data.error) {
          showToast(res.data.error);
        } else {
          showToast('Saved successfully!');
        }
        setState({ ...state, loading: false });
      })
      .catch(err => console.error(err));
  }

  const showToast = text => {
    toast.success(text, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  }

  const updateCode = newCode => {
    setState({ ...state, code: newCode });
  }

  const getModeFromFileName = () => {
    const fileExtension = name.split('.').pop();

    switch (fileExtension) {
      case 'js': return 'javascript';
      case 'jsx': return 'javascript';
      case 'php': return 'php';
      case 'css': return 'css';
      case 'scss': return 'css';
      case 'html': return 'htmlmixed';
      default: return 'markdown';
    }
  }

  let options = {
    mode: getModeFromFileName(),
    lineNumbers: true
  };

  return (
    <div className="editor">
      <ToastContainer />
      <div className="panel-editor">
        <button type="button" className="btn btn-primary" onClick={save}>{i18n.Save}</button>
        <button type="button" className="btn btn-danger" onClick={close}>{i18n.Close}</button>
      </div>
      {state.loading ? <Spinner /> : <CodeMirror value={state.code} onChange={updateCode} options={options} autoFocus />}
    </div>
  );
}

export default Editor;
