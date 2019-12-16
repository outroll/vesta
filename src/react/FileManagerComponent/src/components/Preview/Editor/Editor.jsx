import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import './Editor.scss';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../Spinner/Spinner';
import { toast, ToastContainer } from 'react-toastify';

class Editor extends Component {
  state = {
    code: '',
    loading: false
  }

  encodePath = (path) => {
    let splitPath = path.split('/');
    let encodedPath = splitPath.join('%2F');
    return encodedPath;
  }

  componentWillMount = () => {
    document.addEventListener("keydown", this.hotKey);

    const { history } = this.props;
    let path = history.location.search.substring(6, history.location.search.lastIndexOf('/'));
    this.setState({ loading: true }, () => {
      axios.get(`${window.location.origin}/file_manager/fm_api.php?dir=${this.encodePath(path)}&item=${this.props.name}&action=open_fs_file`)
        .then(result => {
          if (result.data.content) {
            this.setState({ code: result.data.content, loading: false });
          } else {
            toast.warning('This file is empty!', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            });
          }
        })
    })
  }

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.hotKey);
  }

  hotKey = (e) => {
    if (e.keyCode === 113) {
      this.save();
    }
  }

  save = () => {
    let formData = new FormData();
    let path = this.props.history.location.search.substring(6, this.props.history.location.search.lastIndexOf('/'));

    formData.append('save', 'Save');
    formData.append('contents', this.state.code);

    this.setState({ loading: true }, () => {
      axios.post(`${window.location.origin}/edit/file/?path=${path}%2F${this.props.name}`, formData)
        .then(toast.success('Saved successfully!', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        }), this.setState({ loading: false })
        )
    })
  }

  updateCode = (newCode) => {
    this.setState({
      code: newCode
    });
  }

  render() {
    let options = {
      mode: 'javascript',
      lineNumbers: true
    };
    return (
      <div className="editor">
        <ToastContainer />
        <div className="panel-editor">
          <button type="button" className="btn btn-primary" onClick={this.save}>Save</button>
          <button type="button" className="btn btn-danger" onClick={this.props.close}>Close</button>
        </div>
        {this.state.loading ? <Spinner /> : <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} autoFocus />}
      </div>
    );
  }
}

export default withRouter(Editor);