import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { mailInfoBlockSelectOptions } from 'src/ControlPanelService/Mail';

import './MailInfoBlock.scss';

export default function MailInfoBlock({ webMail, hostName, domain, password }) {
  const { i18n } = window.GLOBAL.App;
  const [selectedOption, setSelectedOption] = useState('');
  const { userName } = useSelector(state => state.session);
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
    return mailInfoBlockSelectOptions.map(option =>
      <option key={option.type} value={option.type}>{option.value}</option>
    );
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
            <span><a href={webMail}>{webMail}</a></span>
          </div>

          <input type="hidden" name={i18n['Username']} value={`@${domain}`} />
          <input type="hidden" name={i18n['IMAP hostname']} value={state.imapHostName} />
          <input type="hidden" name={i18n['SMTP hostname']} value={state.smtpHostName} />
          <input type="hidden" name={i18n['IMAP port']} value={state.imapPort} />
          <input type="hidden" name={i18n['SMTP port']} value={state.smtpPort} />
          <input type="hidden" name={i18n['IMAP security']} value={state.imapEncryption} />
          <input type="hidden" name={i18n['SMTP security']} value={state.smtpEncryption} />
          <input type="hidden" name={i18n['IMAP auth method']} value={i18n['Normal password']} />
          <input type="hidden" name={i18n['SMTP auth method']} value={i18n['Normal password']} />
        </div>
      </div>
    </div>
  );
}