import React from 'react';

import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import { Link } from 'react-router-dom';

const EditServerDnsOption = ({ dnsSystem, selected, dnsCluster, visible }) => {
  const { i18n } = window.GLOBAL.App;

  const printHosts = () => {
    return dnsCluster.map((cluster, index) => (
      <TextInput
        title={`${i18n['DNS Server']} #${index + 1}`}
        name="v_dns_remote_host"
        id="dns-remote-host"
        value={cluster}
        disabled />
    ));
  }

  return (
    <div className="server-dns-option" style={{ display: `${visible ? 'block' : 'none'}` }}>
      <TextInput
        optionalTitle={<Link to={`/edit/server/${dnsSystem}`}>{i18n['configure']}</Link>}
        title={i18n['DNS Server'] + ' / '}
        name="v_dns_system"
        value={dnsSystem}
        id="dns_system"
        disabled />

      <SelectInput
        title={i18n['DNS Cluster']}
        selected={selected}
        options={[i18n['no'], i18n['yes']]}
        name="v_dns_cluster"
        id="dns-cluster"
        disabled />

      {
        selected === 'yes' && (
          <div className="hosts-wrapper">
            {printHosts()}
          </div>
        )
      }
    </div>
  );
}

export default EditServerDnsOption;