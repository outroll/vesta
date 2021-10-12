import React, { useEffect, useState } from 'react';
import EditMailAccount from 'src/components/MailAccount/Edit/EditMailAccount';
import EditMail from 'src/components/Mail/Edit/EditMail';
import { useHistory } from 'react-router-dom';
import QueryString from 'qs';
import { Helmet } from 'react-helmet';

export default function EditMailWrapper() {
  const { i18n } = window.GLOBAL.App;
  const history = useHistory();
  const parsedQueryString = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });
  const [isMailAccount, setIsMailAccount] = useState(false);

  useEffect(() => {
    if (parsedQueryString.domain && parsedQueryString.account) {
      setIsMailAccount(true);
    } else {
      setIsMailAccount(false);
    }
  }, [history.location]);

  return (
    <>
      <Helmet>
        <title>{`Vesta - ${i18n.MAIL}`}</title>
      </Helmet>
      {
        isMailAccount
          ? <EditMailAccount domain={parsedQueryString.domain} account={parsedQueryString.account} />
          : <EditMail />
      }
    </>
  );
}