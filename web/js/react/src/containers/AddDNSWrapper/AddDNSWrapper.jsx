import React, { useEffect, useState } from 'react';
import AddDomainNameSystem from 'src/components/DomainNameSystem/Add/AddDomainNameSystem';
import AddDNSRecord from 'src/components/DNSRecord/Add/AddDNSRecord';
import { useHistory } from 'react-router-dom';
import QueryString from 'qs';
import { Helmet } from 'react-helmet';

export default function AddDNSWrapper() {
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });
  const [isDnsRecord, setIsDnsRecord] = useState(false);

  useEffect(() => {
    if (parsedQueryString.domain) {
      setIsDnsRecord(true);
    } else {
      setIsDnsRecord(false);
    }
  }, [history.location]);

  return (
    <>
      <Helmet>
        <title>{`Vesta - ${i18n.DNS}`}</title>
      </Helmet>
      {
        isDnsRecord
          ? <AddDNSRecord domain={parsedQueryString.domain} />
          : <AddDomainNameSystem />
      }
    </>
  );
}