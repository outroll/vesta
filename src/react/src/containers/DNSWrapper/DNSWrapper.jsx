import QueryString from 'qs';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import DnsRecords from '../DNSRecords/DNSRecords';
import DomainNameSystems from '../DomainNameSystems/DomainNameSystems';

export default function DNSWrapper(props) {
  const { i18n } = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQueryString = QueryString.parse(location.search, { ignoreQueryPrefix: true });
  const [isDnsRecords, setIsDnsRecords] = useState(false);

  useEffect(() => {
    if (parsedQueryString.domain) {
      setIsDnsRecords(true);
    } else {
      setIsDnsRecords(false);
    }
  }, [location]);

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