import React, { useEffect, useState } from 'react';

import { addActiveElement } from 'src/actions/MainNavigation/mainNavigationActions';
import TopPanel from 'src/components/TopPanel/TopPanel';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import QueryString from 'qs';

import './WebLogs.scss';
import { getWebLogs } from 'src/ControlPanelService/WebLogs';
import Spinner from 'src/components/Spinner/Spinner';
import { Helmet } from 'react-helmet';
import parse from 'html-react-parser';

export default function WebLogs() {
  const { i18n, userName } = useSelector(state => state.session);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mainNavigation = useSelector(state => state.mainNavigation);
  const [domain, setDomain] = useState();
  const [state, setState] = useState({
    data: "",
    prefix: "",
    loading: false
  });

  useEffect(() => {
    if (!userName) {
      navigate('/login/');
    }
  }, []);

  useEffect(() => {
    let parsedQueryString = QueryString.parse(window.location.search, { ignoreQueryPrefix: true });
    const { domain, type } = parsedQueryString;

    if (!parsedQueryString && !domain && !type) {
      return navigate(-1);
    }

    setDomain(domain);
    let uri = `/list/web-log/?domain=${domain}&type=${type}`;
    fetchData(uri);

    dispatch(addActiveElement(`/list/web-log/?domain=${domain}&type=${type}`));
  }, [mainNavigation.activeElement]);

  const fetchData = uri => {
    setState({
      ...state,
      loading: true
    });

    getWebLogs(uri)
      .then(result => {
        if (result.data) {
          setState({ ...state, data: result.data.data, prefix: result.data.prefix, loading: false });
        }
      })
      .catch(error => {
        console.error(error);
        setState({ ...state, loading: false });
      });
  }

  const menuItems = [
    {
      route: `/list/web-log/?domain=${domain}&type=access`,
      name: i18n['AccessLog']
    },
    {
      route: `/list/web-log/?domain=${domain}&type=error`,
      name: i18n['ErrorLog']
    }
  ];

  const extraMenuItems = [
    {
      link: `/download/web-log/?domain=${domain ?? ''}&type=access`,
      type: 'download',
      text: i18n['Download AccessLog']
    },
    {
      link: `/download/web-log/?domain=${domain ?? ''}&type=error`,
      type: 'download',
      text: i18n['Download ErrorLog'],
    }
  ];

  return (
    <div className="web-logs">
      <Helmet>
        <title>{`Vesta - ${i18n.WEB}`}</title>
      </Helmet>
      <TopPanel menuItems={menuItems} extraMenuItems={extraMenuItems} />
      <div className="content">
        <h6><b>{state.prefix}</b></h6>
        <br />
        {
          state.loading
            ? <Spinner />
            : (
              <pre>
                {state.data ? parse(state.data) : ''}
              </pre>
            )
        }
      </div>
    </div>
  );
}
