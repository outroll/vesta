import React, { useEffect, useState } from 'react';
import AddMailAccount from 'src/components/MailAccount/Add/AddMailAccount';
import AddMail from 'src/components/Mail/Add/AddMail';
import { useHistory } from 'react-router-dom';
import QueryString from 'qs';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

export default function AddMailWrapper() {
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const [domain, setDomain] = useState(false);

  useEffect(() => {
    const parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });

    if (parsedQueryString.domain) {
      setDomain(parsedQueryString.domain);
    } else {
      setDomain('');
    }
  }, [history.location]);

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