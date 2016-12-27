import { Component, OnInit, Input } from '@angular/core';
import { ConversationService, Message } from '../conversation.service';

@Component({
  selector: 'app-send-message',
  templateUrl: './app-send-message.component.html',
  styleUrls: ['./app-send-message.component.css']
})
export class AppSendMessageComponent implements OnInit {
  @Input() conversationId: string;
  messageText: string;
  private socket;
  constructor(private conversationService: ConversationService) {
  }

  ngOnInit() {

  }

  keyupEvent(event: KeyboardEvent){
    if(event.keyCode == 13) this.sendMessage();
  }

  sendMessage(){
    this.conversationService.sendMessage(this.conversationId, this.messageText);
    this.messageText = '';
  }
}
