import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {
  private currentUserSubject = new Subject<User>();
  isChangeCurrentUser$ = this.currentUserSubject.asObservable();

  currentUser: null | User =
    null || JSON.parse(localStorage.getItem('currentUser') as string);

  fbProvider = new FacebookAuthProvider();
  googleProvider = new GoogleAuthProvider();

  set currentUserValue(value: User) {
    this.currentUserSubject.next(value);
  }

  // set the userDoc function
  setUserDoc = async (res: UserCredential, displayName?: string) => {
    const currentUser: User = {
      displayName: res.user.displayName || displayName,
      email: res.user.email,
      isOnline: true,
      lastLogOutTime: null,
      lastSignInTime: res.user.metadata.lastSignInTime,
      photoURL: res.user.photoURL,
      uid: res.user.uid,
    };

    const docRef = doc(db, 'users', res.user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ ...docSnap.data(), uid: docSnap.id, isOnline: true })
      );
      this.currentUser = {
        ...docSnap.data(),
        uid: docSnap.id,
        isOnline: true,
      } as User;
    } else {
      await setDoc(docRef, currentUser);
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.currentUser = currentUser;
    }
  };

  async signUpWithFacebook() {
    try {
      const res = await signInWithPopup(auth, this.fbProvider);
      // const credential = FacebookAuthProvider.credentialFromResult(res);
      // const accessToken = credential?.accessToken;
      await this.setUserDoc(res);
    } catch (err) {
      console.log(err);
    }
  }

  async signUpWithGoogle() {
    try {
      const res = await signInWithPopup(auth, this.googleProvider);
      // const credential = await GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      await this.setUserDoc(res);
    } catch (error) {
      console.log(error);
    }
  }

  logOut = async () => {
    if (!this.currentUser) return;

    try {
      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        isOnline: false,
        lastLogOutTime: new Date().toUTCString(),
      });
      await signOut(auth);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('selectedUserLink');
      this.currentUser = null;
    } catch (error) {
      console.log(error);
    }
  };

  createUserWithEmailPass = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await this.setUserDoc(res, displayName);
    } catch (error) {
      console.log(error);
    }
  };
}
