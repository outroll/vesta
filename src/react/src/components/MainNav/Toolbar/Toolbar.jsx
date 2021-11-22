import React, { useEffect, useState } from 'react';
import './Toolbar.scss';

const Toolbar = props => {
  const [toolbarHeight, setToolbarHeight] = useState(185);

  useEffect(() => {
    window.addEventListener("resize", handleToolbar);
    document.addEventListener("scroll", changeToolbarHeight);

    return () => {
      window.removeEventListener("resize", handleToolbar);
      document.removeEventListener("scroll", changeToolbarHeight);
    }
  }, []);

  const handleToolbar = () => {
    if (document.documentElement.clientWidth < 900) {
      setToolbarHeight(95);
    } else {
      setToolbarHeight(185);
    }
  }

  const changeToolbarHeight = () => {
    if (document.documentElement.clientWidth > 900) {
      let scrollTop = window.scrollY;
      let newToolbarHeight = Math.max(95, 185 - scrollTop);
      setToolbarHeight(newToolbarHeight);
    }
  }

  const className = () => {
    const { className } = props;

    if (className === "justify-right") {
      return toolbarHeight === 95 ? "toolbar t-shadow " + className : "toolbar " + className;
    }

    return toolbarHeight === 95 ? "toolbar t-shadow" : "toolbar";
  }

  const style = () => {
    if (props.mobile) {
      return;
    }

    if (document.documentElement.clientWidth > 900) {
      return { marginTop: toolbarHeight };
    } else {
      return { marginTop: 33 };
    }
  }

  return (
    <div className={className()} style={style()} id="v-toolbar">
      {props.children}
    </div>
  );
}

export default Toolbar;