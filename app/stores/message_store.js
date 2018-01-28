import Dispatcher from '../dispatcher';
import { Action, ActionType } from '../actions';
import { EventEmitter } from 'events';
import axios from 'axios';

export default class MessageStore {
  constructor() {
    this.dispatcher = new Dispatcher();
    this.token = this.dispatcher.register(this.handleEvents);
  }

  async handleEvents(action) {
    let response;

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
          const urlSearchParams = new URLSearchParams();
          urlSearchParams.append('userAddress', action.data.userAddress);
          urlSearchParams.append('roomAddress', action.data.roomAddress);
          urlSearchParams.append('optionalLastMessage', action.data.optionalLastMessage);
          response = await axios.get(`http://localhost:3750/rooms/messages?${urlSearchParams.toString()}`);
          emitter.emit('MESSAGE_AVAILABLE', response.data.messages);
          break;
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  pollForMessages(userAddress, roomAddress) {
    const action = new Action(ActionType.DISPLAY_MESSAGES, {
      userAddress,
      roomAddress,
      optionalLastMessage: 0,
    });

    setInterval(() => this.dispatcher.dispatch(action), 5000);
  }

  listenForMessages(callback) {
    emitter.on('MESSAGE_AVAILABLE', callback);
  }
}
