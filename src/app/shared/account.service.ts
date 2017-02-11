import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable()
export class AccountService {
  userAccount: UserAccount = null;

  constructor(
    private crypto: CryptoService
  ) {
    this.userAccount = this.createNewAccount();
  }

  get userId(): string {
    return this.userAccount.id;
  }

  get userName(): string {
    return this.userAccount.name;
  }

  setAccount(account: UserAccount): void {
    this.userAccount = account;
  }

  createNewAccount(): UserAccount {
    let account = new UserAccount();
    account.id = this.crypto.newSecret();
    account.name = account.id.slice(0,10);
    return account;
  }
}

class UserAccount {
  id: string;
  name: string;
}