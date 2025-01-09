import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.scss']
})
export class BlockchainComponent implements OnInit {
  walletConnected = false;
  ethereumAddress = '';

  constructor() {}

  ngOnInit(): void {}

  connectMetaMask(): void {
    // MetaMask connection logic
    if ((window as any).ethereum) {
      (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          this.walletConnected = true;
          this.ethereumAddress = accounts[0];
        })
        .catch((error: any) => {
          console.error('Failed to connect MetaMask', error);
        });
    } else {
      alert('MetaMask not found');
    }
  }
}