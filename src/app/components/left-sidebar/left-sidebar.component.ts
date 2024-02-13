import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { FindFriendsComponent } from '../find-friends/find-friends.component';
import { ChatService } from '../../services/chat.service';
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';
import { db, storage } from '../../../firebase/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css',
  imports: [ModalComponent, FindFriendsComponent, CommonModule, FormsModule],
})
export class LeftSidebarComponent implements OnInit {
  constructor(
    private AuthService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}
  isOpenModal = false;
  isLoading = false;
  isConfirm = false;
  isEdited: boolean = false;
  currentUser = this.AuthService.currentUser;
  updatedData: UpdatedData = {
    displayName: '',
    email: '',
    photoURL: '',
  };
  file: null | File = null;
  previewUrl = '';
  hide = false;

  ngOnInit(): void {
    if (this.currentUser) {
      onSnapshot(
        doc(db, 'users', this.currentUser.uid),
        (doc) => {
          this.AuthService.currentUser = {
            ...(doc.data() as User),
            uid: doc.id,
          };
          localStorage.setItem(
            'currentUser',
            JSON.stringify(this.AuthService.currentUser)
          );
          this.currentUser = this.AuthService.currentUser;
          this.AuthService.currentUserValue = this.currentUser;
          console.log(this.currentUser);
        },
        (err) => console.log(err)
      );
    }
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.hide = event.url.includes('user');
      });
  }

  onImageUpload = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      this.file = file;
      this.previewUrl = URL.createObjectURL(file);
      this.isEdited = true;
    } else {
      this.isEdited = false;
    }
  };

  uploadImageToFirebase = async (file: File) => {
    try {
      if (file && this.currentUser) {
        const storageRef = ref(storage, this.currentUser.uid);
        const uploadTask = await uploadBytes(storageRef, file);

        getDownloadURL(uploadTask.ref).then((url) => {
          if (!this.currentUser) return;
          this.previewUrl = url;
          updateDoc(doc(db, 'users', this.currentUser.uid), {
            photoURL: url,
          });
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  updateUserInfo = async () => {
    this.isLoading = true;
    if (!this.currentUser) return;

    if (this.file) {
      await this.uploadImageToFirebase(this.file);
    }

    if (this.updatedData.displayName) {
      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        displayName: this.updatedData.displayName,
      });
    }

    if (this.updatedData.email) {
      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        email: this.updatedData.email,
      });
    }

    this.isLoading = false;
    this.isOpenModal = false;
  };

  toggleModal = () => {
    this.isOpenModal = !this.isOpenModal;
  };

  handleEditable = (element: HTMLElement) => {
    element.contentEditable = 'true';
    element.focus();
  };

  handleBlur = (element: HTMLElement) => {
    element.contentEditable = 'false';
  };

  onKeyUp = (element: HTMLElement, key: 'displayName' | 'email') => {
    if (!this.currentUser) return;
    const maxLength = 25; // Set your desired maximum length
    const content = element.textContent || '';
    if (content.length > maxLength) {
      element.textContent = content.slice(0, maxLength);
    }

    if (element.innerText.trim() !== this.currentUser[key]?.trim()) {
      this.updatedData[key] = element.innerText.trim();
      this.isEdited = true;
    } else {
      this.isEdited = false;
    }
  };

  handleConfirmLogout = () => {
    this.isOpenModal = false;
    this.isConfirm = !this.isConfirm;
  };

  logOut = async () => {
    await this.AuthService.logOut();
    this.router.navigate(['/login']);
    this.isConfirm = false;
    this.chatService.selectedUserLink = null;
  };
}
