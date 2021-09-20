
import { WebsocketService } from './websocket.service';
import { Peer2peerService } from './peer2peer.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DownloadButtonComponent } from './download-button/download-button.component';

@NgModule({
  declarations: [
    AppComponent,
    DownloadButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [WebsocketService, 
              Peer2peerService
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
