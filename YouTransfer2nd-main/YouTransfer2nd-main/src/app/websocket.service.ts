import { Injectable } from '@angular/core';

enum wsMessages {
  ID = 'myid',
  MSG = 'msg',
  HANDSHAKE = 'handshake',
  ALLFILES = 'files',
  FILEREQUEST = 'filereq',
  FILESEND = 'filesend'
}

interface wsGenericMsg {
  type: wsMessages;
  data: any;
}
interface wsDirectMsg extends wsGenericMsg {
  to: string;
  from: string;
  message: string;
}
interface wsHandshakeMsg extends Omit<wsDirectMsg, 'message'> {
  message: {
      stage: number;
      data: string | null
  }
}
interface wsFileListMsg extends wsGenericMsg {
  data: availableFile[]
}

export interface availableFile {
  owner: string;
  type: string;
  size: number;
  name: string;
  id: string;
}


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private ws: WebSocket = new WebSocket("ws://77.54.205.151/", ['json']);
  private myId: string = '';
  allFiles: availableFile[] = []

  constructor() {

    this.ws.onmessage = this.receviedMessages.bind(this)
  }

  private send(data:any){
    this.ws.send(JSON.stringify(data))

  }

  requestFile(file: availableFile) {
    console.log(`give me "${file.name}"`)

  }

  distributeFile(file: File) {
    console.log(`making "${file.name}" available`)
    // console.log(file)

    const fileOffer: availableFile = {
      owner: this.myId,
      type: file.type,
      size: file.size,
      name: file.name,
      id: `F${file.lastModified}`
    }

    const fileOfferMsg: wsGenericMsg= {
      type: wsMessages.FILESEND,
      data: fileOffer
    }
    this.send(fileOfferMsg)
  }

  private receviedMessages(message: MessageEvent) {

    let parsed = JSON.parse(message.data) as wsGenericMsg
    // console.log(messagecount, message.data, parsed)

    switch (parsed.type) {
      case wsMessages.ID:
        this.processMyId(parsed)

        break;

      case wsMessages.MSG:
        this.processMsg(parsed as wsDirectMsg)

        break;

      case wsMessages.HANDSHAKE:
        this.processHandshakes(parsed as wsHandshakeMsg)

        break;

      case wsMessages.ALLFILES:
        this.processAllFiles(parsed as wsFileListMsg)

        break;

      default:
      // console.log(parsed);
    }

  }

  private processMyId(message: wsGenericMsg) {

    this.myId = message.data

    console.log(this.myId)


  }

  private processMsg(message:wsDirectMsg ) {

  }

  private processHandshakes(message:wsHandshakeMsg) {

    
  }

  private processAllFiles(message: wsFileListMsg) {
    this.allFiles = message.data;
    console.log( this.allFiles)
  }

}
