import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {

  private userRandomSeed: Array<number>;

  constructor() {
    this.userRandomSeed = [];
    this.initUserRandomSeed();
  }

  public encrypt(data: string, secret: string){
    var dataSecret = this.newSecret();
    let cipherData = CryptoJS.AES.encrypt(data, dataSecret).toString();
    let cipherSecret = CryptoJS.AES.encrypt(dataSecret, secret).toString();
    return cipherSecret + "." + cipherData;
  }

  public decrypt(cipher: string, secret: string) {
    let parts = cipher.split('.');
    let cipherData = parts[1];
    let cipherSecret = parts[0];
    let dataSecret = CryptoJS.AES.decrypt(cipherSecret, secret).toString(CryptoJS.enc.Utf8);
    let data = CryptoJS.AES.decrypt(cipherData, dataSecret).toString(CryptoJS.enc.Utf8);
    return data;
  }

  public hash(subject: string) {
    return CryptoJS.SHA512(subject).toString();
  }

  public smallHash(subject: string) {
    return CryptoJS.SHA256(subject).toString();
  }

  public newSecret(): string {
    return this.getUserRandomSeed();
    //return CryptoJS.SHA512(Math.random()).toString();
  }

  public getUserRandomSeed(){
    let computerRandom = Math.random();
    let seed = "";
    this.userRandomSeed.forEach(n => seed += (computerRandom * n).toString() );
    return CryptoJS.SHA512(seed).toString();
  }

  /**
   * Generate a random seed using the mouse;
   */
  private initUserRandomSeed() {
    let takeEveryNEvent = 50;
    let counter = 0;
    document.addEventListener('mousemove', (event: MouseEvent) => {
      if(counter % takeEveryNEvent != 0){
        counter++;
        return false;
      }
      counter= 1;
      this.userRandomSeed.push(event.clientX + event.clientY);
      if(this.userRandomSeed.length > 10){
        this.userRandomSeed.shift();
      }
    }); 
  }

}