import React from 'react';
import './Dropdown.scss';

const { i18n } = window.GLOBAL.App;

function changeSorting(field, order, props) {
  if (!props.isActive) {
    return;
  } else {
    props.changeSorting(field, order);
  }
}

function sort(sorting) {
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

function button(sorting, order) {
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

const Dropdown = (props) => {
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