import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class EncrDecrService {
  encryptSecretKey: string = "ASWQ@#$%RSADASD#@#@DSADFSF#$R@DFSSDF55454554WEWQ2@@!DDFD";
  constructor() { }

  //The set method is use for encrypt the value.
  set(keys: string, value: string) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  get(keys: string, value: string) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  encryptData(data: any) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
      return "";
    }
  }

  decryptData(data: any) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      return bytes.toString(CryptoJS.enc.Utf8)
    } catch (e) {
      return "";
    }
  }
}