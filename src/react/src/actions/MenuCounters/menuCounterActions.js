import { REFRESH_COUNTERS } from './menuCounterTypes';
import { checkAuth } from 'src/services/session';
import { setAuthToken } from 'src/utils/token';
import { REFRESH_PANEL } from '../Panel/panelTypes';

export const refreshCounters = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    checkAuth()
      .then(res => {
        const { data, token, panel } = res.data;

        if (token) setAuthToken(token);

        dispatch({
          type: REFRESH_COUNTERS,
          value: {
            user: data
          }
        });

        dispatch({
          type: REFRESH_PANEL,
          value: {
            panel
          }
        });

        resolve(token);
      })
      .catch(err => {
        reject();
        console.error(err);
      });
  });
}
