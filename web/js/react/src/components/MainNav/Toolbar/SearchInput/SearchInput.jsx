import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './SearchInput.scss';

const SearchInput = props => {
  const [searchTerm, setSearchTerm] = useState('');
  let inputElement = useRef(null);

  const handleClick = () => {
    if (searchTerm && searchTerm !== '') {
      return props.handleSearchTerm(searchTerm);
    }

    return;
  }

  useEffect(() => {
    window.addEventListener("keyup", focusInput);

    return () => window.removeEventListener("keyup", focusInput);
  }, []);

  const focusInput = event => {
    if (event.keyCode === 70) {
      return inputElement.current.focus();
    }
  }

  return (
    <div className="search-input-form">
      <input type="text" className="form-control" onChange={e => setSearchTerm(e.target.value)} ref={inputElement} />
      <button className="btn btn-outline-secondary" type="submit" onClick={() => handleClick()}><FontAwesomeIcon icon="search" /></button>
    </div>
  );
}

export default SearchInput;