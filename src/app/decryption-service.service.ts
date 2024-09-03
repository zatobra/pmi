import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DecryptionServiceService {
  private key = CryptoJS.enc.Utf8.parse('sH3jn9TdZLQHf8Pq'); 

  constructor() { }

  decrypt(value: string): string {
    if (!value) {
      return '';
    }
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(value), this.key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }
}