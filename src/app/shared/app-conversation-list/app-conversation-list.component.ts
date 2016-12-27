import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { ConversationService, Conversation } from '../conversation.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './app-conversation-list.component.html',
  styleUrls: ['./app-conversation-list.component.css']
})
export class AppConversationListComponent implements OnInit, OnChanges {
  
  conversations: Array<Conversation>;
  filteredConversations: Array<Conversation>;
  filterString: string;
  focusedConversationId: string;

  constructor(
    private router: Router,
    private conversationService: ConversationService,
    private activeRoute: ActivatedRoute) {
    this.conversations = [];
    this.filteredConversations = [];
    this.filterString = "";
    this.focusedConversationId = '';

    conversationService.conversations
      .subscribe(conversation => this.addNewConversations(conversation));

    this.router.events.subscribe(event => this.onRouteChange(event));  
  }

  onRouteChange(event: any) {
    this.getFocusedConversation();
  }

  ngOnInit() { 
    this.getFocusedConversation();
  }

  ngOnChanges() { }

  gotoNewConversationScreen() {
    this.router.navigate(['/messenger/new']);
  }

  focusConversation(conversation: Conversation) {
     this.router.navigate(['/messenger/c',conversation.id]);
  }

  addNewConversations(conversation: Conversation) {
    this.conversations.push(conversation);
    conversation.messages.subscribe(x => this.sortConversations());
    this.filterConversations();
  }

  getFocusedConversation() {
    let url = this.router.url;
    if(url.startsWith('/messenger/c/')){
      this.focusedConversationId = url.split('/').pop();
    }else{
      this.focusedConversationId = "";
    }
  }
  
  filterConversations() {
    this.filteredConversations = this.conversations
    .filter(x => this.filterString == "" || x.name.toLowerCase().indexOf(this.filterString.toLowerCase()) > -1)
  }

  sortConversations(){
    this.conversations = this.conversations.sort((a, b) => {
      if(a.lastActivity < b.lastActivity) {
        return 1;
      }else if(a.lastActivity > b.lastActivity){
        return -1;
      }else{
        return 0;
      }
    });
  }

}
