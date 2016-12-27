import { Component, OnInit, HostBinding } from '@angular/core';
import { ConversationService, Message, Conversation } from '../shared/conversation.service';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';


@Component({
  selector: 'app-new-conversation-pane',
  templateUrl: './new-conversation-pane.component.html',
  styleUrls: ['./new-conversation-pane.component.css']
})
export class NewConversationPaneComponent implements OnInit {
  conversationId: string;
  constructor(
    private router: Router,
    private conversationService: ConversationService) {
    this.conversationId = "";
  }

  ngOnInit() {
  }

  joinConversation() {
    let conversation = this.conversationService.join(this.conversationId);
    if(conversation instanceof Conversation == false){
      alert("Invalid Secret!");
    }
    this.focusConversation(conversation);
  }

  startConversation() {
    if(this.conversationId.length == 0) {
      return alert("Lease enter a conversation name.");
    }
    if(this.conversationId.length > 50) {
      return alert("Conversation name cannot be more than 50 characters!");
    }
    let conversation = this.conversationService.create(this.conversationId);
    this.focusConversation(conversation);
  }

  focusConversation(conversation: Conversation) {
    this.router.navigate(['/messenger/c',conversation.id]);
  }
}
