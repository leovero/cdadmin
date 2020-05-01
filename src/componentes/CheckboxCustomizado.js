import React, { Component } from 'react';

export default class CheckboxCustomizado extends Component {
    render() {
      return (
        <div class="br-checkbox">
          <input
            type="checkbox"
            id={this.props.id}
            value={this.props.value}
            name={this.props.name}
            checked={this.props.isChecked}
            disabled={this.props.disabled}
            onChange={this.props.onChange}/>
          <label
            aria-hidden="true"
            htmlFor={this.props.id}/>
          <label htmlFor={this.props.id}>
            {this.props.label}
          </label>
        </div>
      );
    }
}