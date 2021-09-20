import { Component } from '@angular/core';
import { Peer2peerService } from './peer2peer.service';
import { WebsocketService } from './websocket.service';

interface FileOffer{
  
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'peertest';

  fileOffers=[]

  myPeer:any
  constructor(public ws:WebsocketService, peerConnection:Peer2peerService){
  }

  fileSet(e:Event){
    const fileInput = e.target as HTMLInputElement
    if(!fileInput.files || !fileInput.files.length){
      return
    }
    const choosenFile = fileInput.files[0]

    
    this.ws.distributeFile(choosenFile)
    fileInput.value = ''

  }

  startPeer(file:any){
    console.log(file)
    // this.myPeer = this.peerConnection
  }

}
