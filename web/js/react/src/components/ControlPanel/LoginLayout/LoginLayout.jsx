import React from 'react';

import '../AddItemLayout/AddItemLayout.scss';
import './LoginLayout.scss';

const LoginLayout = ({ children }) => {
  return (
    <div className="login-layout">
      {children}
    </div>
  );
}

export default LoginLayout;