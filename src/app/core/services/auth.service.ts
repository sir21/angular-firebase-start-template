import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LocalUser, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private fireAuth: AngularFireAuth
  ) { }

  async login(email: string, password: string) {
    return await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  saveLoginData(user: User) {
    const now = new Date();
    const saveUser: LocalUser = {
      uid: user.uid,
      username: user.username,
      email: user.email,
      time: now.getTime(),
      expire: now.setDate(now.getDate() + 1)
    }
    localStorage.setItem('user', JSON.stringify(saveUser));
  }

  async register(email: string, password: string) {
    return this.fireAuth.createUserWithEmailAndPassword(email, password)
  }

  async logout() {
    localStorage.removeItem('user');
    await this.fireAuth.signOut();
  }

  async authState() {
    return this.fireAuth.authState.toPromise();
  }

  isLoggedIn() {
    const userString = localStorage.getItem('user');
    if (userString == null) {
      return false;
    }
    const user = JSON.parse(userString) as LocalUser;
    const now = new Date();
    if (user.expire < now.getTime()) {
      this.logout();
      return false;
    }
    return true;
  }

  getUser(): LocalUser | null {
    const userString = localStorage.getItem('user');
    if (userString == null) {
      return null;
    }
    return JSON.parse(userString) as LocalUser;
  }
}
