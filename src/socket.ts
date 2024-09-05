import { GameState } from "./types/gamestate";
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

class SocketManager {
  private _onLobbyUpdate: (players: string[]) => void
  private _onStateUpdate: (gs: GameState) => void
  private _onLobbyJoinSuccess: (uname: string) => void

  private socket: WebSocket

  public guid: string;

  constructor() {
    this._onLobbyUpdate = (_) => {}
    this._onStateUpdate = (_) => {}
    this._onLobbyJoinSuccess = () => {}
    this.guid = crypto.randomUUID().toString()
    this.socket = new WebSocket("ws://localhost:9001/");
  }

  connect() {
    this.socket.onopen = (_) => {
      console.log("Connecting to server.")

      let connectionRequest = { tag: "ConnectRequest", contents: this.guid};
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

  onStateUpdate(fn: (gs: AppState) => void) {
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
