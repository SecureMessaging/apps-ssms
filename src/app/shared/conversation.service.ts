import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subscription } from 'rxjs/Subscription';
import { SocketService, SocketMessage, SocketMessageType } from './socket.service';
import { CryptoService } from './crypto.service';
import { AccountService } from './account.service';
import { StorageService, StorageItem } from './storage.service';

@Injectable()
export class ConversationService {
  private conversationDictionary: conversationDictionary;
  public conversations: ReplaySubject<Conversation>;

  constructor(
    private socket: SocketService,
    private crypto: CryptoService,
    private storage: StorageService,
    private account : AccountService
  ) {
    this.conversationDictionary = {};
    this.conversations = new ReplaySubject<Conversation>();

    this.socket.messages.subscribe(
      (message: SocketMessage) => message.type == SocketMessageType.Message && this.incommingMessage(message)
    );

    this.socket.messages.subscribe(
      (message: SocketMessage) => message.type == SocketMessageType.Joined && this.getOrCreateConversation(message.room)
    );

    this.loadConversationsFromStorage();
  }

  private loadConversationsFromStorage() {
    let items = this.storage.getItems('conversation');
    items.forEach(item => this.join(item.value));
  }

  public create(name: string): Conversation {
    let secret = this.crypto.newSecret();
    let conversation = new Conversation();
    conversation.id = this.crypto.smallHash(name + "Conversation" + secret);
    conversation.name = name;
    conversation.messages = new ReplaySubject<Message>();
    conversation.secret = secret;
    this.conversationDictionary[conversation.id] = conversation;
    this.conversations.next(conversation);
    this.storage.saveItem('conversation', conversation.id, conversation.getSharable());
    this.beginListeningToConversation(conversation);
    return conversation;
  }

  public join(sharable: string) {
    let conversation = Conversation.parseSharable(sharable);
    if(conversation == null) {
      return null;
    }
    if(this.conversationExists(conversation.id) == false) {
      this.conversationDictionary[conversation.id] = conversation;
      this.conversations.next(conversation);
      this.storage.saveItem('conversation', conversation.id, conversation.getSharable());
      this.beginListeningToConversation(conversation);
      return conversation;
    }else{
      return this.getConversation(conversation.id);
    }
  }

  public parseSharable(sharable: string): Conversation {
    return Conversation.parseSharable(sharable);
  }

  public subscribe(conversationId: string, method: ((value) => void)): Subscription {
    let conversation = this.getOrCreateConversation(conversationId);
    return conversation.messages.subscribe(method);
  }

  private beginListeningToConversation(conversation: Conversation){
    this.socket.joinRoom(conversation.id, conversation.secret);
  }

  public sendMessage(conversationId: string, messageText: string): void {
    let message = new Message();
    message.from = this.account.userName;
    message.message = messageText;
    message.timestamp = new Date().getTime();
    this.socket.sendMessage(conversationId, message);
  }

  public getOrCreateConversation(conversationId: string): Conversation {
    let conversation;
    if( this.conversationExists(conversationId) ) {
      conversation = this.getConversation(conversationId);
    } else {
      conversation =  this.initConversation(conversationId);
    }

    return conversation;
  }

  public conversationExists(conversationId: string): boolean {
    if(this.conversationDictionary[conversationId] != undefined){
      return true;
    }else{
      return false;
    }
  }
  
  private incommingMessage(sMessage: SocketMessage) {
    if(sMessage.fromMe) {
      sMessage.message.from = '@me';
    }
    let conversation = this.getConversation(sMessage.room);
    conversation.lastActivity = new Date().getTime();
    conversation.messages.next(sMessage.message);
  }

  private initConversation(conversationId: string): Conversation {
    if(this.conversationDictionary[conversationId] == undefined){Message
      let conversation = this.conversationDictionary[conversationId] = new Conversation();
      conversation.messages = new ReplaySubject<Message>();
      conversation.id = conversationId;
      this.socket.joinRoom(conversationId, conversationId);
      this.conversations.next(conversation);
      return conversation;
    }else{
      throw `${conversationId} is already a conversation!`;
    }
  }

  public getConversation(conversationId: string): Conversation {
    if(this.conversationDictionary[conversationId] != undefined){
      return this.conversationDictionary[conversationId];
    }else{
      throw `${conversationId} is not a conversation!`;
    }
  }

}

interface conversationDictionary {
  [conversationId:string]: Conversation;
}

export enum MessageTypes {
  Request,
  Message,
  WhoIs,
  Config  
}

export class Conversation {
  id: string;
  secret: string;
  name: string;
  messages: ReplaySubject<Message>;
  lastActivity: number = 0;

  static parseSharable(sharable: string): Conversation {
    try {
      let payload: any = JSON.parse(atob(sharable));
      let conversation = new Conversation();
      conversation.id = payload.id;
      conversation.name = payload.name;
      conversation.secret = payload.secret;
      conversation.messages = new ReplaySubject<Message>();
      return conversation;
    } catch(err){
      return null;
    }
  }

  public getSharable(): string {
    let payload = JSON.stringify({
      id: this.id,
      name: this.name,
      secret: this.secret
    });
    return btoa(payload);
  }
}

export interface Conversation {
  id: string;
  messages: ReplaySubject<Message>;
}

export class Message {
  from: string;
  message: string;
  timestamp: number;
}

export interface Message {
  from: string;
  message: string;
  timestamp: number;
}
