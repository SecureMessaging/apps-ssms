import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { MessengerComponent } from './messenger/messenger.component';
import { ConversationPaneComponent } from './conversation-pane/conversation-pane.component';
import { NewConversationPaneComponent } from './new-conversation-pane/new-conversation-pane.component';

export const rootRouterConfig: Routes = [
  {path: '', redirectTo: 'messenger', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'style-guide', component: StyleGuideComponent},
  {
    path: 'messenger',
    component: MessengerComponent,
    children: [
      {path: '', redirectTo: 'new', pathMatch: 'full'},
      {path: 'new', component: NewConversationPaneComponent},
      {path: 'c/:id', component: ConversationPaneComponent}
    ]
  }
];
