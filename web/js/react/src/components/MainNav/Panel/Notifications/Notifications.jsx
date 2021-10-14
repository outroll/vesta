import React, { useState, useEffect } from 'react';
import { getAppNotifications, deleteNotification } from '../../../../ControlPanelService/Notifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Notifications.scss';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getAppNotifications()
      .then(res => {
        if (res.data) {
          const result = [];

          for (let notification in res.data) {
            result.push(res.data[notification]);
          }

          setNotifications(result);
          setLoading(false);
        }
      })
      .catch(err => console.error(err))
  }

  const removeNotification = id => {
    deleteNotification(id)
      .then(() => {
        fetchData();
      })
      .catch(err => console.error(err));
  }

  const renderOptions = () => {
    if (notifications.length) {
      return notifications.map(item => {
        return (
          <React.Fragment>
            <div className="dropdown-item">
              <span className="title"><b>{item.TOPIC}</b></span>
              <span className="delete-notification" onClick={() => removeNotification(item.ID)}></span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: item.NOTICE }}></div>
            <div className="dropdown-divider"></div>
          </React.Fragment>
        );
      });
    } else {
      return (
        <div className="dropdown-item" style={{ cursor: 'default', marginBottom: '10' }}>
          <span className="title">{window.GLOBAL.App.Constants.NOTIFICATIONS_EMPTY}</span>
        </div>
      );
    }
  }

  return (
    <div className="btn-group">
      <button type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <div className="bell">
          <FontAwesomeIcon icon="bell" />
        </div>
      </button>
      <div className="dropdown-menu">
        {loading ? 'Loading' : renderOptions()}
      </div>
    </div>
  );
};

export default Notifications;