import React, { Component } from 'react';
import { Action, ActionType } from '../actions';
import Dispatcher from '../dispatcher';
import MessageStore from '../stores/message_store';
//import {Rectangle} from 'react-shapes';

export default class Chattxt extends Component {
  constructor(props) {
    super(props);
    this.store = new MessageStore();
    this.state = {messages: []};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.params = new URLSearchParams(props.location.search);
    this.userAddress = this.params.get('userAddress');
    this.roomAddress = this.params.get('roomAddress');
    this.keystore = this.params.get('keystore');
    this.password = this.params.get('password');

    if (!this.userAddress || !this.roomAddress || !this.keystore || !this.password) {
      alert('Invalid connection to room. Please try again.');
      this.props.history.push('/');
    }
  }

  handleSubmit(event) {
    const messageBox = document.getElementById('message');
    const message = messageBox.value;
    messageBox.value = "";
    let messages = this.state.messages;
    messages.push(message);
    this.setState({messages});

    const action = new Action(ActionType.MESSAGE_POSTED, {
      userAddress: this.userAddress,
      roomAddress: this.roomAddress,
      keystore: this.keystore,
      password: this.password,
      message: message,
    });


    const dispatcher = new Dispatcher();
    dispatcher.dispatch(action);
    event.preventDefault();
  }

  render() {
    return (
      <div>

      <div className="container4" >
      <ul>
      {
        this.state.messages.map(function(name, index){
          return <li key={ index }>{name}</li>;
        })
      }
      </ul>
      </div>
      {/*<Rectangle width={400} height={100} fill={{color:'#fafafa'}} stroke={{color:'#E65243'}} strokeWidth={3} />*/}
      <div className="container3" >
      <form onSubmit={this.handleSubmit}>
        <label>
          Enter Message:
          <input className="textForm" type="text" id="message" />
        </label>
        <input className="submit" type="submit" value="Submit" />
      </form>
      </div>
      </div>

    )
  }
}
