import React, { Component } from 'react';
import classNames from 'classname';

const defaultPermissions = {
  owner: {
    read: 0,
    write: 0,
    execute: 0,
  },
  group: {
    read: 0,
    write: 0,
    execute: 0,
  },
  others: {
    read: 0,
    write: 0,
    execute: 0,
  },
}

class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: this.decode(this.props.permissions) || defaultPermissions,
      inputInvalid: false,
    }
  }

  inArray(number, array) {
    return !!~array.indexOf(number);
  }

  decodeSingleNumber = (string) => {
    const number = parseInt(string, 0);

    return {
      read: this.inArray(number, [4, 5, 6, 7]) ? 4 : 0,
      write: this.inArray(number, [2, 3, 6, 7]) ? 2 : 0,
      execute: this.inArray(number, [1, 3, 5, 7]) ? 1 : 0
    };
  }

  isValid(numbers = '') {
    if (numbers.length !== 3 || numbers === '000' || numbers.match(/[A-Za-z]/)) {
      return false;
    }

    return numbers.split('').find((number) => parseInt(number, 0) < 0 || parseInt(number, 0) > 7) === undefined;
  }

  decode(numbers) {
    if (!this.isValid(numbers)) {
      return null;
    }

    const numbersArray = numbers.split('');
    const result = numbersArray.map(this.decodeSingleNumber);
    return { owner: result[0], group: result[1], others: result[2] };
  }

  encode() {
    function sumPermissions(permissionObject) {
      return Object.values(permissionObject).map((number) => parseInt(number, 0)).reduce((acc, n) => acc + n, 0);
    }
    return ['owner', 'group', 'others'].reduce((acc, role) => {
      const roleObject = this.state.permissions[role];
      return acc + sumPermissions(roleObject);
    }, '');
  }

  onChangeForm = (event) => {
    const checkbox = event.target;
    const [role, permissionName] = checkbox.name.split('_');
    this.setState({
      permissions: {
        ...this.state.permissions,
        [role]: {
          ...this.state.permissions[role],
          [permissionName]: checkbox.checked ? checkbox.value : 0,
        }
      }
    }, (state) => {
      this.inputRef.value = this.encode();
      this.props.changePermissions(this.inputRef.value);
    });
  }

  handleInputChange = (event) => {
    const value = event.target.value;
    if (!this.isValid(value)) {
      return this.setState({ inputInvalid: true });
    }

    this.setState({
      permissions: this.decode(value),
      inputInvalid: false,
    });
    this.props.changePermissions(this.inputRef.value);
  }

  render() {
    const { Constants } = window.GLOBAL.App;
    const { inputInvalid } = this.state;
    const { close, save, fName } = this.props;
    const inputClasses = classNames({
      'form-control total': true,
      'error': inputInvalid,
    });

    return (
      <div className="modal-content permissions">
        <div className="modal-header">
          <h3 className="modal-title perms">{Constants.FM_CHMOD} <span className="quot">&quot;{fName}&quot;</span></h3>
        </div>
        <form name="form" onChange={this.onChangeForm}>
          <div>
            <label><input type="checkbox" name={'owner_read'} value="4" checked={!!this.state.permissions["owner"].read} id="read" />{Constants.FM_READ_BY_OWNER}</label>
            <label><input type="checkbox" name={'owner_write'} value="2" checked={!!this.state.permissions["owner"].write} />{Constants.FM_WRITE_BY_OWNER}</label>
            <label><input type="checkbox" name={'owner_execute'} value="1" checked={!!this.state.permissions["owner"].execute} />{Constants.FM_EXECUTE_BY_OWNER}</label>
          </div>
          <div>
            <label><input type="checkbox" name={'group_read'} value="4" checked={!!this.state.permissions["group"].read} id="read" />{Constants.FM_READ_BY_GROUP}</label>
            <label><input type="checkbox" name={'group_write'} value="2" checked={!!this.state.permissions["group"].write} />{Constants.FM_WRITE_BY_GROUP}</label>
            <label><input type="checkbox" name={'group_execute'} value="1" checked={!!this.state.permissions["group"].execute} />{Constants.FM_EXECUTE_BY_GROUP}</label>
          </div>
          <div>
            <label><input type="checkbox" name={'others_read'} value="4" checked={!!this.state.permissions["others"].read} id="read" />{Constants.FM_READ_BY_OTHERS}</label>
            <label><input type="checkbox" name={'others_write'} value="2" checked={!!this.state.permissions["others"].write} />{Constants.FM_WRITE_BY_OTHERS}</label>
            <label><input type="checkbox" name={'others_execute'} value="1" checked={!!this.state.permissions["others"].execute} />{Constants.FM_EXECUTE_BY_OTHERS}</label>
          </div>
        </form>
        <input type="text" className={inputClasses} defaultValue={this.encode()} ref={(ref) => this.inputRef = ref} onChange={this.handleInputChange} maxLength="3" />
        <div className="modal-footer">
          <button type="button" className="btn btn-danger mr-auto" onClick={close}>{Constants.FM_CANCEL}</button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={inputInvalid}>{Constants.FM_OK}</button>
        </div>
      </div>
    );
  }
}

export default Permissions;