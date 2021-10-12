import React from 'react';

import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import { Link } from 'react-router-dom';

const EditServerWebOption = ({ proxySystem, webSystem, webBackend, webBackendPool, visible = false }) => {
  const { i18n } = window.GLOBAL.App;

  return (
    <div className="server-web-option" style={{ display: `${visible ? 'block' : 'none'}` }}>

      {
        proxySystem && (
          <TextInput
            optionalTitle={<Link to={`/edit/server/${proxySystem}`}>{i18n['configure']}</Link>}
            title={i18n['Proxy Server'] + ' / '}
            name="v_proxy_system"
            value={proxySystem}
            id="proxy_system"
            disabled />
        )
      }

      {
        webSystem && (
          <TextInput
            optionalTitle={<Link to={`/edit/server/${webSystem}`}>{i18n['configure']}</Link>}
            title={i18n['Web Server'] + ' / '}
            name="v_web_system"
            value={webSystem}
            id="web_system"
            disabled />
        )
      }

      {
        webBackend && (
          <TextInput
            title={i18n['Backend Server']}
            name="v_web_backend"
            value={webBackend}
            id="web_backend"
            disabled />
        )
      }

      {
        webBackendPool && (
          <TextInput
            optionalTitle={<Link to={`/edit/server/${webBackendPool}`}>{i18n['configure']}</Link>}
            title={i18n['Backend Pool Mode']}
            name="v_web_backend_pool"
            value={webBackendPool}
            id="web_backend_pool"
            disabled
          />
        )
      }

    </div>
  );
}

export default EditServerWebOption;