import React, { useEffect, useState } from 'react';

import { addActiveElement } from 'src/actions/MainNavigation/mainNavigationActions';
import TopPanel from 'src/components/TopPanel/TopPanel';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getServiceLogs } from 'src/ControlPanelService/Server';
import Spinner from 'src/components/Spinner/Spinner';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';

import './styles.scss';
import QueryString from 'qs';

const ServiceInfo = () => {
  const { i18n, userName } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const history = useHistory();
  const [state, setState] = useState({
    data: "",
    loading: false
  });

  useEffect(() => {
    if (!userName) {
      history.push('/login/');
    }
  }, [userName]);

  useEffect(() => {
    let queryParams = QueryString.parse(history.location.search, { ignoreQueryPrefix: true });

    if (!queryParams.srv) {
      fetchData('cpu');
      dispatch(addActiveElement('/list/server/service/?srv=cpu'));
      return;
    }

    if (!menuItems.find(item => item.service === queryParams.srv)) {
      dispatch(addActiveElement('/list/server/service/?srv=cpu'));
      history.push('/list/server/service/?srv=cpu');
      return;
    }

    fetchData(queryParams.srv);
    dispatch(addActiveElement(`/list/server/service/?srv=${queryParams.srv}`));
  }, [history.location.search]);

  const fetchData = serviceName => {
    setState({ ...state, loading: true });

    getServiceLogs(serviceName)
      .then(result => {
        setState({ ...state, data: result.data.service_log, loading: false });
      })
      .catch(error => {
        console.error(error);
        setState({ ...state, loading: false });
      });
  }

  const menuItems = [
    {
      route: '/list/server/service/?srv=cpu',
      service: 'cpu',
      name: i18n['CPU']
    },
    {
      route: '/list/server/service/?srv=mem',
      service: 'mem',
      name: i18n['MEMORY']
    },
    {
      route: '/list/server/service/?srv=disk',
      service: 'disk',
      name: i18n['DISK']
    },
    {
      route: '/list/server/service/?srv=net',
      service: 'net',
      name: i18n['NETWORK']
    },
    {
      route: '/list/server/service/?srv=web',
      service: 'web',
      name: i18n['WEB']
    },
    {
      route: '/list/server/service/?srv=dns',
      service: 'dns',
      name: i18n['DNS']
    },
    {
      route: '/list/server/service/?srv=mail',
      service: 'mail',
      name: i18n['MAIL']
    },
    {
      route: '/list/server/service/?srv=db',
      service: 'db',
      name: i18n['DB']
    }
  ];

  return (
    <div className="service-info">
      <Helmet>
        <title>{`Vesta - ${i18n.SERVER}`}</title>
      </Helmet>
      <TopPanel menuItems={menuItems} />
      <div className="content">
        {
          state.loading
            ? <Spinner />
            : (<pre>
              {state.data && ReactHtmlParser(state.data)}
            </pre>)
        }
      </div>
    </div>
  );
}

export default ServiceInfo;
