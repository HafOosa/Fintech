import { Component } from '@angular/core';

@Component({
  selector: 'app-crypto-icons',
  standalone: true,
  styleUrls: ['./crypto-icons.component.scss'], 
  template: `
    <div class="crypto-icon icon-bitcoin"></div>
    <div class="crypto-icon icon-ethereum"></div>
    <div class="crypto-icon icon-litecoin"></div>
    <div class="crypto-icon icon-dogecoin"></div>
    <div class="crypto-icon icon-cardano"></div>
  `,
 
})
export class CryptoIconsComponent {}
