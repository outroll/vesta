import React, { useEffect, useState } from 'react';

import SelectInput from 'src/components/ControlPanel/AddItemLayout/Form/SelectInput/SelectInput';
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import Checkbox from 'src/components/ControlPanel/AddItemLayout/Form/Checkbox/Checkbox';
import { Link } from 'react-router-dom';

const EditDatabaseOption = ({ data, visible }) => {
  const { i18n } = window.GLOBAL.App;

  const printPhpMyAdminHosts = () => {
    if (data.mysql_hosts.length) {
      return data.mysql_hosts.map((host, index) => (
        <div className="hosts">
          <TextInput
            title={`${i18n['Host']} #${index + 1}`}
            value={host['HOST']}
            name="v_mysql_host"
            id="mysql_host"
            disabled />

          <TextInput
            title={i18n['Password']}
            name="v_mysql_password"
            id="mysql_password" />

          <TextInput
            title={i18n['Maximum Number Of Databases']}
            value={host['MAX_DB']}
            name="v_mysql_max"
            id="mysql_max"
            disabled />

          <TextInput
            title={i18n['Current Number Of Databases']}
            value={host['U_DB_BASES']}
            name="v_mysql_max"
            id="current-databases"
            disabled />
        </div>
      ));
    }
  }

  const printPgSqlHosts = () => {
    return data.pgsql_hosts.map((host, index) => (
      <div className="hosts">
        <TextInput
          title={`${i18n['Host']} #${index + 1}`}
          value={host['HOST']}
          name="v_pgsql_host"
          id="pgsql_host"
          disabled />

        <TextInput
          title={i18n['Maximum Number Of Databases']}
          value={host['MAX_DB']}
          name="v_psql_max"
          id="psql_max"
          disabled />

        <TextInput
          title={i18n['Current Number Of Databases']}
          value={host['U_DB_BASES']}
          name="v_pgsql_max"
          id="pgsql_current"
          disabled />
      </div>
    ));
  }

  return (
    <div className="server-mail-option" style={{ display: `${visible ? 'block' : 'none'}` }}>
      <SelectInput
        optionalTitle={<Link to="/edit/server/mysql">{i18n['configure']}</Link>}
        title={i18n['MySQL Support'] + ' / '}
        selected={data.mysql}
        options={[i18n['no'], i18n['yes']]}
        name="v_mysql"
        id="mysql"
        disabled />

      {
        data.mysql === 'yes' && (
          <>
            <TextInput
              title={i18n['phpMyAdmin URL']}
              value={data.db_pma_url}
              name="v_mysql_url"
              id="mysql_url" />

            {printPhpMyAdminHosts()}
          </>
        )
      }

      <SelectInput
        optionalTitle={<Link to="/edit/server/postgresql">{i18n['configure']}</Link>}
        title={i18n['PostgreSQL Support'] + ' / '}
        selected={data.pgsql}
        options={[i18n['no'], i18n['yes']]}
        name="v_pgsql"
        id="pgsql"
        disabled />

      {
        data.pgsql === 'yes' && (
          <>
            <TextInput
              title={i18n['phpPgAdmin URL']}
              value={data.pgsql_url}
              name="v_pgsql_url"
              id="pgsql_url" />

            {printPgSqlHosts()}
          </>
        )
      }
    </div>
  );
}

export default EditDatabaseOption;