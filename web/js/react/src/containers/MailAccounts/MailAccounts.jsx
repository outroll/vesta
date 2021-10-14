import React, { useState, useEffect } from 'react';
import { addControlPanelContentFocusedElement, removeControlPanelContentFocusedElement } from '../../actions/ControlPanelContent/controlPanelContentActions';
import { bulkMailAccountAction, getMailAccountList, handleAction } from '../../ControlPanelService/Mail';
import DropdownFilter from '../../components/MainNav/Toolbar/DropdownFilter/DropdownFilter';
import * as MainNavigation from '../../actions/MainNavigation/mainNavigationActions';
import SearchInput from '../../components/MainNav/Toolbar/SearchInput/SearchInput';
import { addFavorite, deleteFavorite } from '../../ControlPanelService/Favorites';
import LeftButton from '../../components/MainNav/Toolbar/LeftButton/LeftButton';
import Checkbox from '../../components/MainNav/Toolbar/Checkbox/Checkbox';
import Select from '../../components/MainNav/Toolbar/Select/Select';
import MailAccount from 'src/components/MailAccount/MailAccount';
import Toolbar from '../../components/MainNav/Toolbar/Toolbar';
import Modal from '../../components/ControlPanel/Modal/Modal';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';

import './MailAccounts.scss';
import { Helmet } from 'react-helmet';

export default function MailAccounts(props) {
  const { i18n } = window.GLOBAL.App;
  const token = localStorage.getItem("token");
  const { controlPanelFocusedElement } = useSelector(state => state.controlPanelContent);
  const { focusedElement } = useSelector(state => state.mainNavigation);
  const dispatch = useDispatch();
  const [modal, setModal] = useState({
    text: '',
    visible: false,
    actionUrl: '',
  });
  const [state, setState] = useState({
    mailAccounts: [],
    mailAccountsFav: [],
    loading: false,
    domain: props.domain,
    toggledAll: false,
    sorting: i18n.Date,
    order: "descending",
    selection: [],
    totalAmount: ''
  });

  useEffect(() => {
    dispatch(removeControlPanelContentFocusedElement());
    fetchData();

    return () => {
      dispatch(removeControlPanelContentFocusedElement());
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleContentSelection);
    window.addEventListener("keydown", handleFocusedElementShortcuts);

    return () => {
      window.removeEventListener("keydown", handleContentSelection);
      window.removeEventListener("keydown", handleFocusedElementShortcuts);
    };
  }, [controlPanelFocusedElement, focusedElement, state.mailAccounts]);

  const handleContentSelection = event => {
    if (event.keyCode === 38 || event.keyCode === 40) {
      if (focusedElement) {
        dispatch(MainNavigation.removeFocusedElement());
      }
    }

    if (event.keyCode === 38) {
      event.preventDefault();
      handleArrowUp();
    } else if (event.keyCode === 40) {
      event.preventDefault();
      handleArrowDown();
    }
  }

  const initFocusedElement = mailAccounts => {
    mailAccounts[0]['FOCUSED'] = mailAccounts[0]['NAME'];
    setState({ ...state, mailAccounts });
    dispatch(addControlPanelContentFocusedElement(mailAccounts[0]['NAME']));
  }

  const handleArrowDown = () => {
    let mailAccounts = [...state.mailAccounts];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(mailAccounts);
      return;
    }

    let focusedElementPosition = mailAccounts.findIndex(mailAccount => mailAccount.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== mailAccounts.length - 1) {
      let nextFocusedElement = mailAccounts[focusedElementPosition + 1];
      mailAccounts[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, mailAccounts });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleArrowUp = () => {
    let mailAccounts = [...state.mailAccounts];

    if (focusedElement) {
      MainNavigation.removeFocusedElement();
    }

    if (controlPanelFocusedElement === '') {
      initFocusedElement(mailAccounts);
      return;
    }

    let focusedElementPosition = mailAccounts.findIndex(mailAccount => mailAccount.NAME === controlPanelFocusedElement);

    if (focusedElementPosition !== 0) {
      let nextFocusedElement = mailAccounts[focusedElementPosition - 1];
      mailAccounts[focusedElementPosition]['FOCUSED'] = '';
      nextFocusedElement['FOCUSED'] = nextFocusedElement['NAME'];
      document.getElementById(nextFocusedElement['NAME']).scrollIntoView({ behavior: "smooth", block: "center" });
      setState({ ...state, mailAccounts });
      dispatch(addControlPanelContentFocusedElement(nextFocusedElement['NAME']));
    }
  }

  const handleFocusedElementShortcuts = event => {
    event.preventDefault();
    let isSearchInputFocused = document.querySelector('input:focus') || document.querySelector('textarea:focus');

    if (controlPanelFocusedElement && !isSearchInputFocused) {
      switch (event.keyCode) {
        case 8: return handleDelete();
        case 13: return handleEdit();
        case 83: return handleSuspend();
        default: break;
      }
    }
  }

  const handleEdit = () => {
    props.history.push(`/edit/mail?domain=${props.domain}&account=${controlPanelFocusedElement}`);
  }

  const handleSuspend = () => {
    const { mailAccounts } = state;
    let currentMailData = mailAccounts.filter(mail => mail.NAME === controlPanelFocusedElement)[0];
    let suspendedStatus = currentMailData.SUSPENDED === 'yes' ? 'unsuspend' : 'suspend';

    displayModal(currentMailData.suspend_conf, `/${suspendedStatus}/mail?domain=${props.domain}&account=${controlPanelFocusedElement}&token=${token}`);
  }

  const handleDelete = () => {
    const { mailAccounts } = state;
    let currentMailData = mailAccounts.filter(mail => mail.NAME === controlPanelFocusedElement)[0];

    displayModal(currentMailData.delete_conf, `/delete/mail/?domain=${props.domain}&account=${controlPanelFocusedElement}&token=${token}`);
  }

  const fetchData = () => {
    setState({ ...state, loading: true });

    getMailAccountList(props.domain)
      .then(result => {
        setState({
          ...state,
          mailAccounts: reformatData(result.data.data),
          webMail: result.data.webMail,
          selection: [],
          mailAccountsFav: result.data.mailAccountsFav,
          totalAmount: result.data.totalAmount,
          loading: false
        });
      })
      .catch(err => console.error(err));
  }

  const reformatData = data => {
    let mailAccounts = [];

    for (let i in data) {
      data[i]['NAME'] = i;
      data[i]['FOCUSED'] = controlPanelFocusedElement === i;
      mailAccounts.push(data[i]);
    }

    return mailAccounts;
  }

  const changeSorting = (sorting, order) => {
    setState({
      ...state,
      sorting,
      order
    });
  }

  const mailAccounts = () => {
    const { mailAccounts } = state;
    const mailAccountsFav = { ...state.mailAccountsFav };
    const result = [];

    mailAccounts.forEach(mailAccount => {
      mailAccount.FOCUSED = controlPanelFocusedElement === mailAccount.NAME;

      if (mailAccountsFav[mailAccount.NAME]) {
        mailAccount.STARRED = mailAccountsFav[mailAccount.NAME];
      } else {
        mailAccount.STARRED = 0;
      }

      result.push(mailAccount);
    });
    let sortedResult = sortArray(result);

    return sortedResult.map((item, index) => {
      return <MailAccount data={item} key={index} domain={state.domain} toggleFav={toggleFav} checkItem={checkItem} handleModal={displayModal} />;
    });
  }

  const checkItem = name => {
    const { selection, mailAccounts } = state;
    let duplicate = [...selection];
    let mailAccountsDuplicate = mailAccounts;
    let checkedItem = duplicate.indexOf(name);

    let incomingItem = mailAccountsDuplicate.findIndex(mailAccount => mailAccount.NAME === name);
    mailAccountsDuplicate[incomingItem].isChecked = !mailAccountsDuplicate[incomingItem].isChecked;

    if (checkedItem !== -1) {
      duplicate.splice(checkedItem, 1);
    } else {
      duplicate.push(name);
    }

    setState({ ...state, mailAccounts: mailAccountsDuplicate, selection: duplicate });
  }

  const sortArray = array => {
    const { order, sorting } = state;
    let sortingColumn = sortBy(sorting);

    if (order === "descending") {
      return array.sort((a, b) => (a[sortingColumn] < b[sortingColumn]) ? 1 : ((b[sortingColumn] < a[sortingColumn]) ? -1 : 0));
    } else {
      return array.sort((a, b) => (a[sortingColumn] > b[sortingColumn]) ? 1 : ((b[sortingColumn] > a[sortingColumn]) ? -1 : 0));
    }
  }

  const sortBy = sorting => {
    const { Date: date, Accounts, Disk, Starred } = i18n;

    switch (sorting) {
      case date: return 'DATE';
      case Accounts: return 'ACCOUNTS';
      case Disk: return 'U_DISK';
      case Starred: return 'STARRED';
      default: break;
    }
  }

  const toggleFav = (value, type) => {
    const { mailAccountsFav } = state;
    let mailAccountsFavDuplicate = mailAccountsFav;

    if (type === 'add') {
      mailAccountsFavDuplicate[value] = 1;

      addFavorite(value, 'mail_acc')
        .then(() => {
          setState({ ...state, mailAccountsFav: mailAccountsFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      mailAccountsFavDuplicate[value] = undefined;

      deleteFavorite(value, 'mail_acc')
        .then(() => {
          setState({ ...state, mailAccountsFav: mailAccountsFavDuplicate });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  const toggleAll = toggled => {
    const mailAccountsDuplicate = [...state.mailAccounts];

    if (toggled) {
      let mailAccountNames = [];

      let mailAccounts = mailAccountsDuplicate.map(mailAccount => {
        mailAccountNames.push(mailAccount.NAME);
        mailAccount.isChecked = true;
        return mailAccount;
      });

      setState({ ...state, mailAccounts, selection: mailAccountNames, toggledAll: toggled });
    } else {
      let mailAccounts = mailAccountsDuplicate.map(mailAccount => {
        mailAccount.isChecked = false;
        return mailAccount;
      });

      setState({ ...state, mailAccounts, selection: [], toggledAll: toggled });
    }
  }

  const bulk = action => {
    const { selection } = state;
    if (selection.length && action) {
      bulkMailAccountAction(action, props.domain, selection)
        .then(result => {
          if (result.status === 200) {
            fetchData();
            toggleAll(false);
          }
        })
        .catch(err => console.error(err));
    }
  }

  const displayModal = (text, url) => {
    setModal({
      ...modal,
      visible: true,
      text: text,
      actionUrl: url
    });
  }

  const modalConfirmHandler = () => {
    handleAction(modal.actionUrl)
      .then(() => {
        fetchData();
        modalCancelHandler();
      })
      .catch(err => console.error(err));
  }

  const modalCancelHandler = () => {
    setModal({
      ...modal,
      visible: false,
      text: '',
      actionUrl: ''
    });
  }

  return (
    <div className="mail-accounts">
      <Helmet>
        <title>{`Vesta - ${i18n.MAIL}`}</title>
      </Helmet>
      <Toolbar mobile={false} >
        <LeftButton name={i18n['Add Mail Account']} href={`/add/mail/?domain=${props.domain}`} showLeftMenu={true} />
        <div className="r-menu">
          <div className="input-group input-group-sm">
            <a href={state.webMail} className="button-extra" type="submit">{i18n['open webmail']}</a>
            <Checkbox toggleAll={toggleAll} toggled={state.toggledAll} />
            <Select list='mailList' bulkAction={bulk} />
            <DropdownFilter changeSorting={changeSorting} sorting={state.sorting} order={state.order} list="mailAccountList" />
            <SearchInput handleSearchTerm={term => props.changeSearchTerm(term)} />
          </div>
        </div>
      </Toolbar>
      {state.loading
        ? <Spinner />
        : (
          <>
            <div className="mail-accounts-wrapper">
              <div className="subtitle">
                <span>{`${i18n['Listing']}  ${state.domain}`}</span>
              </div>
              {mailAccounts()}
            </div>
            <div className="footer-actions-wrapper">
              <div className="total">{state.totalAmount}</div>
              <div className="back">
                <Link to="/list/mail/">{i18n['Back']}</Link>
              </div>
            </div>
          </>
        )
      }
      <Modal
        onSave={modalConfirmHandler}
        onCancel={modalCancelHandler}
        show={modal.visible}
        text={modal.text} />
    </div>
  );
}