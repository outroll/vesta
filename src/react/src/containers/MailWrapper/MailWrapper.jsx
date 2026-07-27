import React, { useEffect, useState } from 'react';
import MailAccounts from '../MailAccounts/MailAccounts';
import { useNavigate, useLocation } from 'react-router-dom';
import Mails from '../Mails/Mails';
import QueryString from 'qs';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

export default function MailWrapper(props) {
  const { i18n } = useSelector(state => state.session);
  const [mailDomain, setMailDomain] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const parsedQueryString = QueryString.parse(location.search, { ignoreQueryPrefix: true });

    if (parsedQueryString.domain) {
      setMailDomain(parsedQueryString.domain);
    } else {
      setMailDomain('');
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>{`Vesta - ${i18n.MAIL}`}</title>
      </Helmet>
      {
        mailDomain
          ? <MailAccounts {...props} domain={mailDomain} changeSearchTerm={props.changeSearchTerm} />
          : <Mails {...props} changeSearchTerm={props.changeSearchTerm} />
      }
    </>
  );
}