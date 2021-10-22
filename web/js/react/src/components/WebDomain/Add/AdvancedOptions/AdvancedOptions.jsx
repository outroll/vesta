import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Password from '../../../../components/ControlPanel/AddItemLayout/Form/Password/Password';
import AdditionalFtpWrapper from '../AdditionalFtpWrapper/AdditionalFtpWrapper';
import SslSupport from '../SslSupport/SslSupport';

import './AdvancedOptions.scss';

const AdvancedOptions = props => {
  const { i18n } = useSelector(state => state.session);
  const [state, setState] = useState({
    sslSupport: false,
    additionalFtp: false,
    statisticsAuthCheckbox: false,
    statisticsAuth: false,
    aliases: ''
  });

  useEffect(() => {
    let updatedDomain = `www.${props.domain}`;
    setState({ ...state, aliases: updatedDomain });
  }, [props.domain]);

  const renderSslSupport = () => {
    if (state.sslSupport) {
      return <SslSupport />;
    }
  }

  const renderAdditionalFtp = () => {
    if (state.additionalFtp) {
      return <AdditionalFtpWrapper prefixI18N={props.prefixI18N} domain={props.domain} unCheckAdditionalFtpBox={() => setState({ ...state, additionalFtp: false })} />;
    }
  }

  const renderWebStats = () => {
    return props.webStats.map(stat => <option value={stat}>{stat}</option>);
  }

  const onChangeWebStatsSelect = value => {
    if (value !== 'none') {
      setState({ ...state, statisticsAuth: true });
    } else {
      setState({ ...state, statisticsAuth: false, statisticsAuthCheckbox: false });
    }
  }

  const onChangeAliases = value => {
    setState({ ...state, aliases: value });
  }

  return (
    <div>
      <div class="form-group">
        <label htmlFor="aliases">{i18n.Aliases}</label>
        <textarea
          class="form-control"
          id="aliases"
          rows="3"
          name="v_aliases"
          onChange={event => onChangeAliases(event.target.value)}
          value={state.aliases}
        ></textarea>
      </div>

      <div className="form-group">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            name="v_ssl"
            id="ssl-support"
            checked={state.sslSupport}
            onChange={() => setState({ ...state, sslSupport: !state.sslSupport })} />
          <label htmlFor="ssl-support">{i18n['SSL Support']}</label>
        </div>
      </div>

      {renderSslSupport()}

      <div class="form-group">
        <label htmlFor="web-stats">{i18n['Web Statistics']}</label>
        <select class="form-control" id="web-stats" name="v_stats" onChange={event => onChangeWebStatsSelect(event.target.value)}>
          {renderWebStats()}
        </select>
      </div>

      <div className={`form-group statistics-authorization ${state.statisticsAuth ? 'show' : 'hide'}`}>
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            name="v_stats_auth"
            id="stats-auth"
            checked={state.statisticsAuthCheckbox}
            onChange={() => setState({ ...state, statisticsAuthCheckbox: !state.statisticsAuthCheckbox })} />
          <label htmlFor="stats-auth">{i18n['Statistics Authorization']}</label>
        </div>
      </div>

      <div className={state.statisticsAuthCheckbox ? 'show web-stats-wrapper' : 'hide'}>
        <div className="form-group">
          <label htmlFor="stats-user">{i18n.Username}</label>
          <input type="text" className="form-control" id="stats-user" name="v_stats_user" />
        </div>

        <Password name='v_stats_password' />
      </div>

      <div className="form-group">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            name="v_ftp"
            id="additional-ftp"
            checked={state.additionalFtp}
            onChange={() => setState({ ...state, additionalFtp: !state.additionalFtp })} />
          <label htmlFor="additional-ftp">{i18n['Additional FTP Account']}</label>
        </div>
      </div>

      {renderAdditionalFtp()}
    </div>
  );
}

export default AdvancedOptions;