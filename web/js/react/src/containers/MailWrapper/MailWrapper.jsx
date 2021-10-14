import React, { useEffect, useState } from 'react';
import MailAccounts from '../MailAccounts/MailAccounts';
import { useHistory } from 'react-router-dom';
import Mails from '../Mails/Mails';
import QueryString from 'qs';
import { Helmet } from 'react-helmet';

export default function MailWrapper(props) {
  const { i18n } = window.GLOBAL.App;
  const [mailDomain, setMailDomain] = useState('');
  const history = useHistory();

  useEffect(() => {
    const parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });

    if (parsedQueryString.domain) {
      setMailDomain(parsedQueryString.domain);
    } else {
      setMailDomain('');
    }
  }, [history.location]);

  return (
    <>
      <Helmet>
        <title>{`Vesta - ${i18n.MAIL}`}</title>
      </Helmet>
      {
        mailDomain
          ? <MailAccounts {...props} domain={mailDomain} changeSearchTerm={props.handleSearchTerm} />
          : <Mails {...props} changeSearchTerm={props.handleSearchTerm} />
      }
    </>
  );
}