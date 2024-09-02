import { Game } from "./types/gamestate";
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

class SocketManager {
  private _onStateUpdate: (gs: Game) => void;
  private socket: WebSocket;

  constructor() {
    this._onStateUpdate = (_) => {};
    this.socket = new WebSocket("ws://localhost:9001/");
  }

  connect() {
    this.socket.onopen = (_) => {
      console.log("Connecting to server.")
      let guid = crypto.randomUUID()
      let connectionRequest = { guid: guid };
      this.socket.send(JSON.stringify(connectionRequest))
    };

    // TODO other types of messages besides updates
    this.socket.onmessage = (event) => {
      console.log("recieved message: ", event.data)
      let message = JSON.parse(event.data)
      if (message.msgType == "StateUpdate") {
        this._onStateUpdate(message.msgData)
      }
      else if (message.msgType == "ErrorNotification") {
        toast(message.msgData, {
          theme: "dark",
          type: "error",
          autoClose: 1000,
        }); // ToastOptions


      }
    };
  }

  disconnect() {
    toast("You are disconnected from the server. Please refresh", {
      theme: "dark",
      type: "error",
      autoClose: false
    })
    console.log('hell')
    console.log('hell')
    this.socket.close();
  }

  onStateUpdate(fn: (gs: Game) => void) {
    console.log("Setting update fn")
    this._onStateUpdate = fn;
    console.log(this._onStateUpdate)
  }

  sendAction(actionType: string, actionData: object) {
    let actionMsg = { tag: actionType, contents: actionData };

    this.socket.send(JSON.stringify(actionMsg));
  }

//   setGuid(guid: string) {
//     let loginMsg = { msgType: "setGuid", msgData: guid };
//     this.socket.send(JSON.stringify(loginMsg));
//   }
}

export const $socket = new SocketManager();
export default $socket;
