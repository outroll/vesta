import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { mailInfoBlockSelectOptions } from 'src/ControlPanelService/Mail';

import './MailInfoBlock.scss';

export default function MailInfoBlock({ webMail, hostName, domain, userName = '', password }) {
  const { i18n } = useSelector(state => state.session);
  const [selectedOption, setSelectedOption] = useState('');
  const [state, setState] = useState({
    imapHostName: hostName,
    smtpHostName: hostName,
    imapEncryption: i18n['STARTTLS'],
    smtpEncryption: i18n['STARTTLS'],
    imapPort: '143',
    smtpPort: '587',
  });

  useEffect(() => {
    if (selectedOption === 'hostname') {
      setState({ ...state, imapHostName: hostName, smtpHostName: hostName });
    } else if (selectedOption === "domain") {
      setState({ ...state, imapHostName: domain, smtpHostName: domain });
    } else if (selectedOption === "starttls") {
      setState({ ...state, imapPort: '143', imapEncryption: 'STARTTLS', smtpPort: '587', smtpEncryption: 'STARTTLS' });
    } else if (selectedOption === "ssl") {
      setState({ ...state, imapPort: '993', imapEncryption: 'SSL / TLS', smtpPort: '465', smtpEncryption: 'SSL / TLS' });
    } else if (selectedOption === "no_encryption") {
      setState({
        ...state,
        imapHostName: domain,
        smtpHostName: domain,
        imapPort: '143',
        smtpPort: '25',
        imapEncryption: i18n['No encryption'],
        smtpEncryption: i18n['No encryption']
      });
    }
  }, [selectedOption]);

  const renderSelectOptions = () => {
    const options = mailInfoBlockSelectOptions(i18n);
    return options.map(option =>
      <option key={option.type} value={option.type}>{option.value}</option>
    );
  }

  const getCredentials = () => {
    let result = '';

    result += `${i18n['Username']}:${userName}@${domain}\n`;
    result += `${i18n['Password']}:${password}\n`;
    result += `${i18n['IMAP hostname']}:${state.imapHostName}\n`;
    result += `${i18n['IMAP port']}:${state.imapPort}\n`;
    result += `${i18n['IMAP security']}:${state.imapEncryption}\n`;
    result += `${i18n['IMAP auth method']}:${i18n['Normal password']}\n`;
    result += `${i18n['SMTP hostname']}:${state.smtpHostName}\n`;
    result += `${i18n['SMTP port']}:${state.smtpPort}\n`;
    result += `${i18n['SMTP security']}:${state.smtpEncryption}\n`;
    result += `${i18n['SMTP auth method']}:${i18n['Normal password']}\n`;
    result += `${i18n['Webmail URL']}:${`http://${window.location.hostname}${webMail}`}\n`;

    return result;
  }

  return (
    <div className="mail-info-block">
      <div class="form-group select-group">
        <select class="form-control" onChange={event => setSelectedOption(event.target.value)}>
          {renderSelectOptions()}
        </select>

        <div className="details">
          <div>
            <span>{i18n['Username']}:</span>
            <span>{`${userName}@${domain}`}</span>
          </div>

          <div>
            <span>{i18n['Password']}:</span>
            <span>{password || '******'}</span>
          </div>

          <div>
            <span>{i18n['IMAP hostname']}:</span>
            <span>{state.imapHostName}</span>
          </div>

          <div>
            <span>{i18n['IMAP port']}:</span>
            <span>{state.imapPort}</span>
          </div>

          <div>
            <span>{i18n['IMAP security']}:</span>
            <span>{state.imapEncryption}</span>
          </div>

          <div>
            <span>{i18n['IMAP auth method']}:</span>
            <span>{i18n['Normal password']}</span>
          </div>

          <div>
            <span>{i18n['SMTP hostname']}:</span>
            <span>{state.smtpHostName}</span>
          </div>

          <div>
            <span>{i18n['SMTP port']}:</span>
            <span>{state.smtpPort}</span>
          </div>

          <div>
            <span>{i18n['SMTP security']}:</span>
            <span>{state.smtpEncryption}</span>
          </div>

          <div>
            <span>{i18n['SMTP auth method']}:</span>
            <span>{i18n['Normal password']}</span>
          </div>

          <div>
            <span>{i18n['Webmail URL']}:</span>
            <span><Link to={{ pathname: `http://${window.location.hostname}${webMail}` }} target="_blank">{webMail}</Link></span>
          </div>

          <input type="hidden" name="v_credentials" value={getCredentials()} />
        </div>
      </div>
    </div>
  );
}