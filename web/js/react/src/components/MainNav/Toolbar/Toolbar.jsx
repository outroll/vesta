import React, { Component } from 'react';
import './Toolbar.scss';

class Toolbar extends Component {
  state = {
    toolbarHeight: 205
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleToolbar);
    document.addEventListener("scroll", this.changeToolbarHeight);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleToolbar);
    document.removeEventListener("scroll", this.changeToolbarHeight);
  }

  handleToolbar = () => {
    if (document.documentElement.clientWidth < 900) {
      this.setState({
        toolbarHeight: 115
      });
    } else {
      this.setState({
        toolbarHeight: 205
      });
    }
  }

  changeToolbarHeight = () => {
    if (document.documentElement.clientWidth > 900) {
      let scrollTop = window.scrollY;
      let toolbarHeight = Math.max(115, 205 - scrollTop);
      this.setState({ toolbarHeight });
    }
  }

  className = () => {
    const { className } = this.props;

    if (className === "justify-right") {
      return this.state.toolbarHeight === 115 ? "toolbar t-shadow " + className : "toolbar " + className;
    }

    return this.state.toolbarHeight === 115 ? "toolbar t-shadow" : "toolbar";
  }

  style = () => {
    if (this.props.mobile) {
      return;
    }

    if (document.documentElement.clientWidth > 900) {
      return { marginTop: this.state.toolbarHeight };
    } else {
      return { marginTop: 145 };
    }
  }

  render() {
    return (
      <div className={this.className()} style={this.style()}>
        {this.props.children}
      </div>
    );
  }
}

export default Toolbar;