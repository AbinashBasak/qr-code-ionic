import { Component, OnDestroy } from '@angular/core';
import {
  BarcodeScanner,
  CameraDirection,
} from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {
  scanResult: string | null = null;
  showCamera = false;
  showFlash = false;
  cameraDirection: CameraDirection = 'back';

  constructor() {
    BarcodeScanner.getTorchState().then((e) => {
      this.showFlash = e.isEnabled;
    });
  }

  async toggleTorch() {
    await BarcodeScanner.toggleTorch();
    const torchStatus = await BarcodeScanner.getTorchState();

    this.showFlash = torchStatus.isEnabled;
  }

  toggleCamera() {
    this.cameraDirection = this.cameraDirection === 'back' ? 'front' : 'back';
    BarcodeScanner.stopScan();
    this.startScan();
  }

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });

      if (status.granted) {
        return true;
      }

      if (status.neverAsked) {
        const c = confirm(
          'We need your permission to use your camera to be able to scan Qr codes'
        );
        return c;
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
      this.showCamera = true;
      const result = await BarcodeScanner.startScan({
        cameraDirection: this.cameraDirection,
      });
      this.showCamera = false;
      if (result.hasContent) {
        this.scanResult = result.content;
      }
    } catch (error) {
      this.showCamera = false;
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    document.querySelector('body')?.classList.remove('scanner-active');
    BarcodeScanner.stopScan();
    this.showCamera = false;
  }

  ngOnDestroy(): void {
    this.startScan();
  }
}
