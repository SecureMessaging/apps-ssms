import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { CryptoService } from './crypto.service';
import * as io from 'socket.io-client';

import * as config from '../../environments/environment';


@Injectable()
export class SocketService {
  private socket: any;
  private roomSecrets: RoomSecrets;
  public connected: boolean = false;
  public messages: Subject<SocketMessage> = new Subject<SocketMessage>();

  constructor(private crypto: CryptoService) {
    this.roomSecrets = {};
    this.socket = io.connect(config.environment.socketUrl);
    this.socket.on('connect', () => this.connect);
    this.socket.on('disconnect', () => this.disconnect);
    this.socket.on('joined', (roomId: string, id: string) => this.joined(roomId, id));
    this.socket.on('message', (roomId: string, message: string, id: string) => this.message(roomId, message, id));
  }

  public joinRoom(roomId: string, secret: string) {
    this.roomSecrets[roomId] = secret;
    this.socket.emit('join', roomId);
  }

  public sendMessage(roomId: string, message:any) {
    let socketMessage: SocketMessage = new SocketMessage();
    socketMessage.room = roomId;
    socketMessage.message = message;
    socketMessage.from = this.socket.id;
    socketMessage.type = SocketMessageType.Message;
    socketMessage.id = this.newMessageId();
    let secret = this.roomSecrets[roomId];
    let data = this.crypto.encrypt(JSON.stringify(socketMessage), secret);
    this.socket.emit('message', roomId, data);
  }
 
  private message(roomId: string, messageData: string, id: string): void {
    let secret = this.roomSecrets[roomId];
    let message: SocketMessage = JSON.parse(this.crypto.decrypt(messageData, secret));
    if(this.isMe(id)){
      message.fromMe = true;
    }
    this.messages.next(message);
  }

  private joined(roomId: string, id: string): void{
    let socketMessage: SocketMessage = new SocketMessage();
    socketMessage.room = roomId;
    socketMessage.message = 'Joined';
    socketMessage.from = id;
    socketMessage.type = SocketMessageType.Joined;
    this.messages.next(socketMessage);
  }

  private connect(){
    console.log('Connected');
    this.connected = true;
  }

  private disconnect(){
    this.connected = false;
    console.log('Disconnected');      
  }

  private isMe(id: string){
    return id == "/#" + this.socket.id;
  }

  private newMessageId(){
    return Math.random()+this.socket.id;
  }

}

interface RoomSecrets {
  [roomId: string]: string;
}

export class SocketMessage {
  id: string
  from: string;
  room: string;
  message: any;
  type: SocketMessageType;
  fromMe: boolean;
}

export enum SocketMessageType {
  Message,
  Joined,
  Left
}
