import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

interface message {
  type: string,
    to: string,
    from: string,
    message: {
        stage: number,
        data: any
    }
}

export class P2PTransfer{

  constructor() {


  }
   
}

@Injectable({
  providedIn:'root'
})

export class Peer2peerService {

  peerConfig = {
    "iceServers": [{
        urls: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com'
     },] 
  }

  locals:RTCPeerConnection[] | undefined
  localChannel:RTCDataChannel | undefined ;

  request?:object

  myPeer?:RTCPeerConnection

  target:string=''
  from:string=''

  constructor(private websock:WebsocketService) {

    // this.websock.ws.onmessage = (message:any) =>{
    //   let parsed = JSON.parse(message.data)
    //   if (parsed.type && parsed.data) {
    //     switch (parsed.type) {
    //         case 'msg':
    //             this.processMsg(parsed.data)
    //         break
    //         default:
    //           console.log('wrong place fam');
    //     }
    //   }
    // }
  }


  startPeer(){
    this.myPeer = this.createPeer(this.target)
    this.request = {
      type: 'msg',
      to: this.target,
      from: this.from,
      message: {
          stage: 0,
          data: null
      }
    }

    this.websock.send(JSON.stringify(this.request))
  }


  private createPeer(target:string){
    let myPeer = new RTCPeerConnection(this.peerConfig) 
    myPeer.onicecandidate = (event) => {
      if (event.candidate) {
          // storesIceCandidate
          this.sendIceCandidate(target,this.from, event.candidate)
      }
    }

    myPeer.ondatachannel = (event)=>{
      const dataChannel = event.channel

      dataChannel.onmessage = async (message)=>{
        console.log('received message', message)
      }
    }

    return myPeer
  }

  sendIceCandidate(to:string, from:string ,candidate:RTCIceCandidate) {
    const request = {
        type: 'msg',
        to: to,
        from: from,
        message: {
            stage: 4,
            data: candidate
        }
    }

    // this.ws.send(JSON.stringify(request))
  }
    
  async processMsg(msg:message) {

    if (typeof msg.message.stage != 'number')
        return


    let request
    switch (msg.message.stage) {
        case 0:
            request = {
                type: 'msg',
                to: msg.from,
                from: this.from,
                message: {
                    stage: 1,
                    data: null
                }
            }

            this.myPeer = this.createPeer(this.from)
            this.websock.send(JSON.stringify(request))

        break;
        case 1:
            const offer = await this.myPeer?.createOffer()
            await this.myPeer?.setLocalDescription(offer)

            request = {
                type: 'msg',
                to: msg.from,
                from: this.from,
                message: {
                    stage: 2,
                    data: this.myPeer?.localDescription
                }
            }

            this.websock.send(JSON.stringify(request))
            break;

        case 2:
            await this.myPeer?.setRemoteDescription(msg.message.data)
            const answer = await this.myPeer?.createAnswer()
            await this.myPeer?.setLocalDescription(answer)
            request = {
                type: 'msg',
                to: msg.from,
                from: this.from,
                message: {
                    stage: 3,
                    data: this.myPeer?.localDescription
                }
            }

            this.websock.send(JSON.stringify(request))
            break;

        case 3:
            await this.myPeer?.setRemoteDescription(msg.message.data)
            break;

        default:
            this.myPeer?.addIceCandidate(msg.message.data)
            break;
    }
    console.log('minha pera',this.myPeer)
  }
}

