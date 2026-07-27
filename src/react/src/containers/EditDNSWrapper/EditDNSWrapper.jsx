import React, { useEffect, useState } from 'react';
import EditDomainNameSystem from 'src/components/DomainNameSystem/Edit/EditDomainNameSystem';
import EditDNSRecord from 'src/components/DNSRecord/Edit/EditDNSRecord';
import { useNavigate, useLocation } from 'react-router-dom';
import QueryString from 'qs';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

export default function EditDNSWrapper() {
  const { i18n } = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQueryString = QueryString.parse(location.search, { ignoreQueryPrefix: true });
  const [isDnsRecord, setIsDnsRecord] = useState(false);

  useEffect(() => {
    if (parsedQueryString.domain && parsedQueryString.record_id) {
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
          ? <EditDNSRecord domain={parsedQueryString.domain} record_id={parsedQueryString.record_id} />
          : <EditDomainNameSystem />
      }
    </>
  );
}