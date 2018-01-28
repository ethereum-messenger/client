import Dispatcher from '../dispatcher';
import { Action, ActionType } from '../actions';
import { EventEmitter } from 'events';
import axios from 'axios';

export default class MessageStore {
  constructor() {
    this.dispatcher = new Dispatcher();
    this.token = this.dispatcher.register(this.handleEvents);
    this.emitter = new EventEmitter();
  }

  async handleEvents(action) {
    let response;
    console.log(action);
    try {
      switch(action.type) {
        case ActionType.ROOM_CREATED:
          response = await axios.post('http://localhost:3750/rooms', action.data);
          console.log(response);
          break;
        case ActionType.USER_INVITED:
          response = await axios.post('http://localhost:3750/invitations', action.data);
          console.log(response);
          break;
        case ActionType.MESSAGE_POSTED:
          response = await axios.post('http://localhost:3750/rooms/messages', action.data);
          console.log(response);
          break;
        case ActionType.DISPLAY_MESSAGES:
          response = await axios.get('http://localhost:3750/rooms/messages', action.data);
          this.emitter.emit('MESSAGE_AVAILABLE', response.messages);
          break;
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  pollForMessages(userAddress, roomAddress) {
    /*
    const action = new Action(ActionType.DISPLAY_MESSAGES, {
      userAddress,
      roomAddress,
      optionalLastMessage: 0,
    });

    setInterval(() => this.dispatcher.dispatch(action), 5000);
    */
  }

  listenForMessages(callback) {
    this.emitter.on('MESSAGE_AVAILABLE', callback);
  }
}
