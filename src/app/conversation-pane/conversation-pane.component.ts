import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ConversationService, Conversation } from '../shared/conversation.service';

@Component({
  selector: 'app-conversation-pane',
  templateUrl: './conversation-pane.component.html',
  styleUrls: ['./conversation-pane.component.css']
})
export class ConversationPaneComponent implements OnInit {
  @HostBinding('class.app-flex-fill') flex: boolean = true;
  @HostBinding('class.app-flex-col') flexCol: boolean = true;

  public conversationId: string;
  public name: string;
  public conversation: Conversation

  constructor(private route: ActivatedRoute,
    private conversationService: ConversationService) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.loadConversation(params['id']))
      .subscribe();
  }

  public loadConversation(conversationId: string): string {
    let conversation = this.conversationService.getConversation(conversationId);
    this.name = conversation.name;
    this.conversationId = conversation.id;
    this.conversation = conversation; 
    return conversationId;
  }

  public share() {
    window.prompt("Copy token below and share token", this.conversation.getSharable());
  }

}
