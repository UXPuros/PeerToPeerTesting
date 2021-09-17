import { TestBed } from '@angular/core/testing';

import { Peer2peerService } from './peer2peer.service';

describe('Peer2peerService', () => {
  let service: Peer2peerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Peer2peerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
