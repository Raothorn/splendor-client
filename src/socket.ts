import { GameState } from "./types/gamestate";
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import {v4 as uuidv4} from 'uuid'

class SocketManager {
  private _onLobbyUpdate: (players: string[]) => void
  private _onStateUpdate: (gs: GameState) => void
  private _onLobbyJoinSuccess: (uname: string) => void

  private socket: WebSocket

  private _guid: string;

  constructor() {
    this._onLobbyUpdate = (_) => {}
    this._onStateUpdate = (_) => {}
    this._onLobbyJoinSuccess = () => {}
    this._guid = this.getGuid();

    let mode = import.meta.env.MODE;
    console.log("MODE: ", mode)
    if (mode == "development") {
      this.socket = new WebSocket("ws://localhost:9001")
    } else {
      this.socket = new WebSocket("ws://ec2-3-16-161-191.us-east-2.compute.amazonaws.com:9001")
    }
  }

  private getGuid():string {

    const key = "splendor_guid"
    let result = sessionStorage.getItem(key)

    if (result == null) {
      result = uuidv4()
      sessionStorage.setItem(key, result)
   }

   return result
  }

  connect() {
    this.socket.onopen = (_) => {
      console.log("Connecting to server.")

      let connectionRequest = { tag: "ConnectRequest", contents: this._guid};
      this.socket.send(JSON.stringify(connectionRequest))
    };

    this.socket.onmessage = (event) => {
      console.log("recieved message: ", event.data)
      let response = JSON.parse(event.data)
      if (response.tag == "GameUpdate") {
        this._onStateUpdate(response.contents)
      }
      else if (response.tag == "LobbyUpdate") {
        this._onLobbyUpdate(response.contents)
      }
      else if (response.tag == "JoinLobbySuccess") {
        let username = response.contents
        this._onLobbyJoinSuccess(username)
      }
      else if (response.tag == "ErrorNotification") {
        toast(response.contents, {
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
    this.socket.close();
  }

  onLobbyUpdate(fn: (players: string[]) => void){
    this._onLobbyUpdate = fn
  }

  onStateUpdate(fn: (gs: GameState) => void) {
    this._onStateUpdate = fn;
  }

  onLobbyJoinSuccess(fn: (username: string) => void) {
    this._onLobbyJoinSuccess = fn
  }

  sendAction(actionType: string, actionData: object) {
    let actionMsg = { tag: actionType, contents: actionData };

    this.socket.send(JSON.stringify(actionMsg));
  }

  sendReady() {
    let msg = { tag: "ReadyToPlayRequest" }
    this.socket.send(JSON.stringify(msg))
  }

  attemptJoinLobby(username: string) {
    let msg = { tag: "JoinLobbyRequest", contents: username }
    this.socket.send(JSON.stringify(msg))
  }

  startGame() {
    let msg = { tag: "StartGameRequest" }
    this.socket.send(JSON.stringify(msg))
  }
}

export const $socket = new SocketManager();
export default $socket;
