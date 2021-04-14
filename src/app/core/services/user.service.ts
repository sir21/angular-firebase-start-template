import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fireStore: AngularFirestore
  ) { }

  createUpdateUser(user: User) {
    return this.fireStore.collection('users').doc(user.uid).set(user);
  }

  getUser(uid: string) {
    return this.fireStore.collection('users').doc(uid).get();
  }
}
