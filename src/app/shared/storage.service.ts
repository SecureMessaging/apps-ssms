import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  private prefix = 'ssms';
  
  constructor() { }

  public saveItem(key: string, name: string, value: string) {
    localStorage.setItem(this.prefix + "_" + key+ "_" + name, value);
  }

  public getItems(key: string): Array<StorageItem>{
    let items:Array<StorageItem> = [];
    for( let keyName in localStorage) {
      if(keyName.startsWith(this.prefix + "_" + key)) {
        let item = new StorageItem(keyName);
        items.push(item);
      }
    }
    return items;
  }
}

export class StorageItem {
  private _key: string;
  private _value: string;
  private _name: string;
  
  constructor(key: string) {
    this._key = key;
    this._value = localStorage.getItem(key);
    this._name = key.split("_").pop();
  }

  get key(): string {
    return this._key;
  }

  get value(): string {
    return this._value;
  }

  get name(): string {
    return this._name;
  }

  update(value: string) {
    localStorage.setItem(this._key, value);
    this._value = value;
  }

  delete():void {
    localStorage.removeItem(this._key);
  }
}