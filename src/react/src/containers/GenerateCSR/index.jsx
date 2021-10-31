import React, { useEffect, useState } from 'react';
import { addActiveElement, removeFocusedElement } from "src/actions/MainNavigation/mainNavigationActions";
import TextInput from 'src/components/ControlPanel/AddItemLayout/Form/TextInput/TextInput';
import AddItemLayout from 'src/components/ControlPanel/AddItemLayout/AddItemLayout';
import TextArea from 'src/components/ControlPanel/AddItemLayout/Form/TextArea/TextArea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from 'src/components/MainNav/Toolbar/Toolbar';
import { generateCSR, getCsrInitialData } from 'src/ControlPanelService/Web';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'src/components/Spinner/Spinner';
import { useHistory } from 'react-router-dom';
import HtmlParser from 'react-html-parser';
import { Helmet } from 'react-helmet';
import QS from 'qs';

const GenerateSSL = props => {
  const token = localStorage.getItem("token");
  const { i18n } = useSelector(state => state.session);
  const history = useHistory();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [okMessage, setOkMessage] = useState('');
  const [state, setState] = useState({
    data: {},
    generatedData: {},
    loading: false,
    domain: ''
  });

  useEffect(() => {
    let queryParams = QS.parse(history.location.search, { ignoreQueryPrefix: true });
    const { domain } = queryParams;

    dispatch(addActiveElement('/list/web/'));
    dispatch(removeFocusedElement());

    if (domain) {
      fetchData(domain);
    } else {
      fetchData();
    }
  }, []);

  const fetchData = (domain = '') => {
    getCsrInitialData(domain)
      .then(response => {
        setState({
          ...state,
          domain,
          generatedData: {},
          data: response.data,
          loading: false
        });
      })
      .catch(err => {
        setState({ ...state, loading: false });
        console.error(err);
      });
  }

  const submitFormHandler = event => {
    event.preventDefault();
    let newCsr = {};

    for (var [name, value] of (new FormData(event.target)).entries()) {
      newCsr[name] = value;
    }

    newCsr['generate'] = 'generate';

    if (Object.keys(newCsr).length !== 0 && newCsr.constructor === Object) {
      setState({ ...state, loading: true });

      generateCSR(newCsr)
        .then(result => {
          if (result.status === 200) {
            const { error_msg: errorMessage, ok_msg: okMessage, crt, key, csr } = result.data;

            if (errorMessage) {
              setErrorMessage(errorMessage);
              setOkMessage('');
              setState({ ...state, generatedData: {}, loading: false });
            } else {
              setErrorMessage('');
              setOkMessage(okMessage);

              setState({ ...state, generatedData: { crt, key, csr }, loading: false });
            }
          }
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div className="edit-template edit-user">
      <Helmet>
        <title>{`Vesta - ${i18n.WEB}`}</title>
      </Helmet>
      <Toolbar mobile={false}>
        <div></div>
        <div className="search-toolbar-name">{i18n['Generating CSR']}</div>
        <div className="error"><span className="error-message">{errorMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} {errorMessage}</span></div>
        <div className="success">
          <span className="ok-message">{okMessage ? <FontAwesomeIcon icon="long-arrow-alt-right" /> : ''} <span>{HtmlParser(okMessage)}</span> </span>
        </div>
      </Toolbar>
      <AddItemLayout date={state.data.date} time={state.data.time} status={state.data.status}>
        {state.loading ? <Spinner /> :
          <form onSubmit={event => submitFormHandler(event)} id="add-user">
            <input type="hidden" name="token" value={token} />

            {
              Object.entries(state.generatedData).length
                ? (<>
                  <TextArea
                    id="csr"
                    name="v_csr"
                    title={i18n['SSL CSR']}
                    defaultValue={state.generatedData.csr} />

                  <TextArea
                    id="crt"
                    name="v_crt"
                    title={i18n['SSL Certificate']}
                    defaultValue={state.generatedData.crt} />

                  <TextArea
                    id="v_key"
                    name="key"
                    title={i18n['SSL Key']}
                    defaultValue={state.generatedData.key} />

                  <div className="buttons-wrapper">
                    <button type="button" className="back" onClick={() => history.push(`/edit/web/?domain=${state.domain}`)}>{i18n.Back}</button>
                  </div>
                </>)
                : (<>
                  <TextInput id="domain" name="v_domain" title={i18n['Domain']} value={state.data.domain} />

                  <TextInput id="email" name="v_email" title={i18n['Email']} value={state.data.email} />

                  <TextInput id="country" name="v_country" title={i18n['Country']} optionalTitle={`(${i18n['2 letter code']})`} value={state.data.country} />

                  <TextInput id="state" name="v_state" title={i18n['State / Province']} value={state.data.state} />

                  <TextInput id="locality" name="v_locality" title={i18n['City / Locality']} value={state.data.locality} />

                  <TextInput id="org" name="v_org" title={i18n['Organization']} value={state.data.org} />

                  <div className="buttons-wrapper">
                    <button type="submit" className="add">{i18n.Save}</button>
                    <button type="button" className="back" onClick={() => history.push(`/edit/web/?domain=${state.domain}`)}>{i18n.Back}</button>
                  </div>
                </>)
            }

          </form>
        }
      </AddItemLayout>
    </div >
  );
}

export default GenerateSSL;
