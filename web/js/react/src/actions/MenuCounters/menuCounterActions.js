import { REFRESH_COUNTERS } from './menuCounterTypes';
import { checkAuth } from 'src/services/session';
import { setAuthToken } from 'src/utils/token';

export const refreshCounters = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    checkAuth()
      .then(res => {
        const { data, token } = res.data;

        if (token) setAuthToken(token);

        dispatch({
          type: REFRESH_COUNTERS,
          value: {
            user: data
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
