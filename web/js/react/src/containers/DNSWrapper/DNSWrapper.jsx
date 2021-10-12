import QueryString from 'qs';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import DnsRecords from '../DNSRecords/DNSRecords';
import DomainNameSystems from '../DomainNameSystems/DomainNameSystems';

export default function DNSWrapper(props) {
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });
  const [isDnsRecords, setIsDnsRecords] = useState(false);

  useEffect(() => {
    if (parsedQueryString.domain) {
      setIsDnsRecords(true);
    } else {
      setIsDnsRecords(false);
    }
  }, [history.location]);

  return (
    <>
      <Helmet>
        <title>{`Vesta - ${i18n.DNS}`}</title>
      </Helmet>
      {
        isDnsRecords
          ? <DnsRecords {...props} changeSearchTerm={props.changeSearchTerm} />
          : <DomainNameSystems {...props} changeSearchTerm={props.changeSearchTerm} />
      }
    </>
  );
}