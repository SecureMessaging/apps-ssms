import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";

import { rootRouterConfig } from "./app.routes";
import { AppComponent } from './app.component';
import { StyleGuideComponent } from './style-guide/style-guide.component';
import { HomeComponent } from './home/home.component';
import { MessengerComponent } from './messenger/messenger.component';
import { AppMessagesComponent } from './shared/app-messages/app-messages.component';
import { ConversationService } from './shared/conversation.service';
import { AppSendMessageComponent } from './shared/app-send-message/app-send-message.component';
import { SocketService } from './shared/socket.service';
import { CryptoService } from './shared/crypto.service';
import { StorageService } from './shared/storage.service';
import { AppConversationListComponent } from './shared/app-conversation-list/app-conversation-list.component';
import { ConversationPaneComponent } from './conversation-pane/conversation-pane.component';
import { NewConversationPaneComponent } from './new-conversation-pane/new-conversation-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    StyleGuideComponent,
    HomeComponent,
    MessengerComponent,
    AppMessagesComponent,
    AppSendMessageComponent,
    AppConversationListComponent,
    ConversationPaneComponent,
    NewConversationPaneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: true })
  ],
  providers: [StorageService, ConversationService, SocketService, CryptoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
