import Dispatcher from '../dispatcher';
import { Action, ActionType } from '../actions';
import axios from 'axios';

export default class MessageStore {
  constructor(mutationFn) {
    this.dispatcher = new Dispatcher();
    this.token = this.dispatcher.register(this.handleEvents.bind(this));
    this.mutationFn = mutationFn;
    this.handleEvents.bind(this);
    this.pollForMessages.bind(this);
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
          this.mutationFn(response.data.messages);
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
}
