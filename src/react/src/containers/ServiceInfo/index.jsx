import React, { useEffect, useState } from 'react';

import { addActiveElement } from 'src/actions/MainNavigation/mainNavigationActions';
import TopPanel from 'src/components/TopPanel/TopPanel';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getServiceLogs } from 'src/ControlPanelService/Server';
import Spinner from 'src/components/Spinner/Spinner';
import { Helmet } from 'react-helmet';
import ReactHtmlParser from 'react-html-parser';

import './styles.scss';

const ServiceInfo = () => {
  const { i18n, userName } = useSelector(state => state.session);
  const dispatch = useDispatch();
  const { activeElement } = useSelector(state => state.mainNavigation);
  const history = useHistory();
  const { service } = useParams();
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
    fetchData();
    dispatch(addActiveElement(`/list/server/${service}`));
  }, [activeElement]);

  const fetchData = () => {
    setState({ ...state, loading: true });

    getServiceLogs(service)
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
      route: '/list/server/cpu',
      name: i18n['CPU']
    },
    {
      route: '/list/server/mem',
      name: i18n['MEMORY']
    },
    {
      route: '/list/server/disk',
      name: i18n['DISK']
    },
    {
      route: '/list/server/net',
      name: i18n['NETWORK']
    },
    {
      route: '/list/server/web',
      name: i18n['WEB']
    },
    {
      route: '/list/server/dns',
      name: i18n['DNS']
    },
    {
      route: '/list/server/mail',
      name: i18n['MAIL']
    },
    {
      route: '/list/server/db',
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
              {state.data.length && state.data.map(line => (<>{ReactHtmlParser(line)}<br /></>))}
            </pre>)
        }
      </div>
    </div>
  );
}

export default ServiceInfo;
