import React, { useEffect, useState } from 'react';
import AddMailAccount from 'src/components/MailAccount/Add/AddMailAccount';
import AddMail from 'src/components/Mail/Add/AddMail';
import { useNavigate, useLocation } from 'react-router-dom';
import QueryString from 'qs';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

export default function AddMailWrapper() {
  const { i18n } = useSelector(state => state.session);
  const navigate = useNavigate();
  const location = useLocation();
  const [domain, setDomain] = useState(false);

  useEffect(() => {
    const parsedQueryString = QueryString.parse(location.search, { ignoreQueryPrefix: true });

    if (parsedQueryString.domain) {
      setDomain(parsedQueryString.domain);
    } else {
      setDomain('');
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>{`Vesta - ${i18n.MAIL}`}</title>
      </Helmet>
      {
        domain
          ? <AddMailAccount domain={domain} />
          : <AddMail />
      }
    </>
  );
}