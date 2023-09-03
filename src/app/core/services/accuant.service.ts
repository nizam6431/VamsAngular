import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccuantService {

  ip: string;
  port: string;
  websocket: WebSocket;
  connected: boolean = false;
  _callBack: any;
  AccuantDataEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  initialize(ip, port, callBack) {
    this.ip = ip;
    this.port = port;
    this._callBack = callBack;
  }


  connect() {
    this.websocket = new WebSocket("ws://" + this.ip + ":" + this.port);
    this.websocket.onopen = (evt) => { this.onOpen(evt) };
    this.websocket.onclose = (evt) => { this.onClose(evt) };
    this.websocket.onmessage = (evt) => { this.onMessage(evt) };
    this.websocket.onerror = (evt) => { this.onError(evt) };
  };

  disConnect() {
    this.websocket.close();
    this.connected = false;
    if (this._callBack == null || this._callBack == undefined) {
      return;
    }
    //this._callBack({ status: "Disconnected", data: "" });
    this.AccuantDataEmitter.emit({ status: "Disconnected", data: "" });

  };

  onOpen(evt) {
    this.connected = true;
    if (this._callBack == null || this._callBack == undefined) {
      return;
    }
    // this._callBack({ status: "Connected", data: "" });
    this.AccuantDataEmitter.emit({ status: "Connected", data: "" });
  };

  onClose(evt) {
    if (this._callBack == null || this._callBack == undefined) {
      return;
    }
    //  this._callBack({ status: "Closed", data: "" });
    this.AccuantDataEmitter.emit({ status: "Closed", data: "" });
  };

  onMessage(evt) {
    if (this._callBack == null || this._callBack == undefined) {
      return;
    }
    //this._callBack({ status: "MessageReceived", data: evt.data });
    this.AccuantDataEmitter.emit({ status: "MessageReceived", data: evt.data });
  };

  onError(evt) {
    if (this._callBack == null || this._callBack == undefined) {
      return;
    }
    this.AccuantDataEmitter.emit({ status: "Error", data: evt.data });
    //this._callBack({ status: "Error", data: evt.data });
  };

  doSend(message) {
    this.websocket.send(message);
  };

  query() {

    if (this._callBack == null || this._callBack == undefined) {
      return;
    }
    this.AccuantDataEmitter.emit({ status: "Query", data: this.ip });
    // this._callBack({ status: "Query", data: this.ip });
  };

  getConnectedStatus() {
    return this.connected;
  };

}
