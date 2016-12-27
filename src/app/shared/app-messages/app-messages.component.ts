import { Component, OnInit, Input, ElementRef, OnChanges } from '@angular/core';
import { ConversationService, Message } from '../conversation.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-messages',
  templateUrl: './app-messages.component.html',
  styleUrls: ['./app-messages.component.css']
})
export class AppMessagesComponent implements OnInit, OnChanges {
  @Input() conversationId: string;
  public messages: Array<Message> = [];
  private conversationSubscription: Subscription = null;

  constructor(
    private element:ElementRef,
    private conversationService: ConversationService) {
    
  }
  
  ngOnChanges() {
    this.listenToConversation(this.conversationId);
  }

  ngOnInit() { }

  onMessageRecieved(message: Message) {

    if(this.getScrollTop() >= this.getScrollHight() ){
      this.scrollToBottom(); 
    }
    this.messages.push(message);
  }

  wasMessageRecieved(message:Message): boolean  {
    return message.from != '@me';
  }

  wasMessageSent(message:Message): boolean {
    return message.from == '@me';
  }

  private listenToConversation(conversationId: string){
    if(this.conversationSubscription){
      this.conversationSubscription.unsubscribe(); //.remove(this.conversationSubscription);
    }
    this.messages = [];
    this.conversationSubscription = this.conversationService
      .subscribe(conversationId, x => this.onMessageRecieved(x));
  }

  private getScrollTop(): number{
    let scrollTop: number = this.element.nativeElement.scrollTop;
    let clientHeight: number = this.element.nativeElement.clientHeight;
    scrollTop += clientHeight;
    return scrollTop;
  }

  private getScrollHight(): number{
    let scrollHeight: number = this.element.nativeElement.scrollHeight;
    return scrollHeight;
  }

  private scrollToBottom(){
    setTimeout(function(){
      let scrollHeight: number = this.element.nativeElement.scrollHeight;
      let scrollTop: number = this.element.nativeElement.scrollTop;
      let offsetHeight: number = this.element.nativeElement.offsetHeight;
      let clientHeight: number = this.element.nativeElement.clientHeight;
      this.element.nativeElement.scrollTop = (scrollHeight - clientHeight);
    }.bind(this), 0);
  }
}
