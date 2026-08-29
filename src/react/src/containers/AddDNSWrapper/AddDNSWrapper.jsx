import React, { useEffect, useState } from 'react';
import AddDomainNameSystem from 'src/components/DomainNameSystem/Add/AddDomainNameSystem';
import AddDNSRecord from 'src/components/DNSRecord/Add/AddDNSRecord';
import { useNavigate, useLocation } from 'react-router';
import QueryString from 'qs';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

export default function AddDNSWrapper() {
  const { i18n } = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQueryString = QueryString.parse(location.search, { ignoreQueryPrefix: true });
  const [isDnsRecord, setIsDnsRecord] = useState(false);

  useEffect(() => {
    if (parsedQueryString.domain) {
      setIsDnsRecord(true);
    } else {
      setIsDnsRecord(false);
    }
  }, [location]);

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