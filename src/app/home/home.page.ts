import { Component, OnDestroy } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  scanResult: any;

  constructor() {}

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async startScan() {
    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      return;
    }

    try {
      BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.scanResult = result.content;
      }
    } catch (error) {}
  }

  stopScan() {
    BarcodeScanner.showBackground();
    document.querySelector('body')?.classList.remove('scanner-active');
    BarcodeScanner.stopScan();
  }

  ngOnDestroy(): void {
    this.startScan();
  }
}
