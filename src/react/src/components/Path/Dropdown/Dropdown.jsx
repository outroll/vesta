import React from 'react';
import { useSelector } from 'react-redux';
import './Dropdown.scss';

const Dropdown = (props) => {
  const { i18n } = useSelector(state => state.session);

  const changeSorting = (field, order, props) => {
    if (!props.isActive) {
      return;
    } else {
      props.changeSorting(field, order);
    }
  }

  const sort = (sorting) => {
    if (sorting === "Type") {
      return i18n.type;
    } else if (sorting === "Size") {
      return i18n.size;
    } else if (sorting === "Date") {
      return i18n.date;
    } else if (sorting === "Name") {
      return i18n.name;
    }
  }

  const button = (sorting, order) => {
    if (order === "descending") {
      return (
        <button type="button" className="btn btn-secondary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {sort(sorting)}
          <span className="arrow-down">&#8595;</span>
        </button>
      );
    } else {
      return (
        <button type="button" className="btn btn-secondary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {sort(sorting)}
          <span>&#8593;</span>
        </button>
      );
    }
  }

  return (
    <div class="btn-group">
      {button(props.sorting, props.order)}
      <div class="dropdown-menu">
        <ul className="dropdown-list">
          <li>
            <span className={props.sorting === "Type" && props.order === "descending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Type", "descending", props)}>{i18n.type}<span className="arrow-down">&#8595;</span></span>
            <span className={props.sorting === "Type" && props.order === "ascending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Type", "ascending", props)}><span>&#8593;</span></span>
          </li>
          <li>
            <span className={props.sorting === "Size" && props.order === "descending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Size", "descending", props)}>{i18n.size}<span className="arrow-down">&#8595;</span></span>
            <span className={props.sorting === "Size" && props.order === "ascending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Size", "ascending", props)}><span>&#8593;</span></span>
          </li>
          <li>
            <span className={props.sorting === "Date" && props.order === "descending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Date", "descending", props)}>{i18n.date}<span className="arrow-down">&#8595;</span></span>
            <span className={props.sorting === "Date" && props.order === "ascending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Date", "ascending", props)}><span>&#8593;</span></span>
          </li>
          <li>
            <span className={props.sorting === "Name" && props.order === "descending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Name", "descending", props)}>{i18n.name}<span className="arrow-down">&#8595;</span></span>
            <span className={props.sorting === "Name" && props.order === "ascending" ? "dropdown-item active" : "dropdown-item"} onClick={() => changeSorting("Name", "ascending", props)}><span>&#8593;</span></span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;