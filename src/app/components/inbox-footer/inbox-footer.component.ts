import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db, storage } from '../../../firebase/firebase';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';
import { PickerComponent, PickerModule } from '@ctrl/ngx-emoji-mart';
import { OutSideClickDirective } from '../../directives/outside-click.directive';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-inbox-footer',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PickerComponent,
    PickerModule,
    OutSideClickDirective,
  ],
  templateUrl: './inbox-footer.component.html',
  styleUrl: 'inbox-footer.css',
})
export class InboxFooterComponent implements OnInit, OnChanges {
  @Input() user!: User | null;
  @Input() messageContainer!: HTMLElement;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  currentUser: User | null = this.authService.currentUser;
  toggle = false;
  textMessage = '';
  previewUrls: string[] = [];
  imageUrls: string[] = [];
  files: File[] = [];
  isLoading = false;
  isBlockedByMe: boolean = false;
  isBlockedByOther: boolean = false;

  selectImoji = ($event: any) => {
    this.textMessage += $event.emoji.native;
  };

  onImageUpload = (e: any) => {
    let files: File[] = e.target.files;
    this.files = [...this.files, ...files];
    if (files.length !== 0) {
      for (let i = 0; i < files.length; i++) {
        this.previewUrls = [...this.previewUrls, URL.createObjectURL(files[i])];
      }
    }
  };

  removeImage = (url: string) => {
    this.previewUrls = this.previewUrls.filter((item) => item !== url);
  };

  uploadImageToFirebase = async () => {
    let urls: string[] = [];
    try {
      for (let i = 0; i < this.files.length; i++) {
        if (this.files.length > 0 && this.currentUser) {
          const storageRef = ref(
            storage,
            this.currentUser.uid + this.files[i].name
          );
          const uploadTask = await uploadBytes(storageRef, this.files[i]);
          const url = await getDownloadURL(uploadTask.ref);
          urls = [...urls, url];
          this.previewUrls = [];
        }
      }
    } catch (error) {
      console.error(error);
    }
    return urls;
  };

  onSubmit = async () => {
    if (this.isBlockedByMe && this.isBlockedByOther) return;
    if (
      (this.textMessage.trim() || this.previewUrls.length > 0) &&
      this.user &&
      this.currentUser &&
      this.chatService.chatId
    ) {
      this.isLoading = true;
      let message: Message = {
        date: new Date().toUTCString(),
        id: uuid.v4(),
        chatId: this.chatService.chatId,
        img: this.imageUrls,
        senderId: `${this.currentUser?.uid}`,
        text: this.textMessage,
        read: false,
      };

      const userChats: UserChat = {
        lastMessage: message,
        ...this.user,
      };

      const userChats2: UserChat = {
        lastMessage: message,
        ...this.currentUser,
      };

      try {
        const messageRef = doc(db, 'messages', this.chatService.chatId);
        const currChatRef = doc(db, 'userChats', this.currentUser.uid);
        const userChatRef = doc(db, 'userChats', this.user.uid);

        const messageSnap = await getDoc(messageRef);
        const currentUserSnap = await getDoc(currChatRef);
        const userChatsSnap = await getDoc(userChatRef);

        if (messageSnap.exists()) {
          if (messageSnap.data()['deletedBy']) {
            if (this.previewUrls.length > 0) {
              this.imageUrls = await this.uploadImageToFirebase();
            }
            updateDoc(messageRef, {
              message: arrayUnion({ ...message, img: this.imageUrls }),
              deletedBy: {
                [this.currentUser.uid]: false,
              },
            });

            this.imageUrls = [];
            this.files = [];
            this.textMessage = '';
            this.isLoading = false;
          } else {
            if (this.previewUrls.length > 0) {
              this.imageUrls = await this.uploadImageToFirebase();
            }
            await updateDoc(messageRef, {
              message: arrayUnion({ ...message, img: this.imageUrls }),
            });
            this.imageUrls = [];
            this.files = [];
            this.textMessage = '';
            this.isLoading = false;
          }
          this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        } else {
          if (this.previewUrls.length > 0) {
            this.imageUrls = await this.uploadImageToFirebase();
          }
          await setDoc(messageRef, {
            message: arrayUnion({ ...message, img: this.imageUrls }),
          });
          this.imageUrls = [];
          this.files = [];
          this.textMessage = '';
          this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }

        // current user
        if (currentUserSnap.exists()) {
          await updateDoc(currChatRef, {
            [this.chatService.chatId]: userChats,
          });
        } else {
          await setDoc(doc(db, 'userChats', this.currentUser.uid), {
            [this.chatService.chatId]: userChats,
          });
        }

        // user
        if (userChatsSnap.exists()) {
          await updateDoc(userChatRef, {
            [this.chatService.chatId]: userChats2,
          });
        } else {
          await setDoc(doc(db, 'userChats', this.user.uid), {
            [this.chatService.chatId]: userChats2,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  unBlock = () => {
    if (this.currentUser) {
      const docRef = doc(db, 'users', this.currentUser.uid);
      updateDoc(docRef, {
        blockedUsers: arrayRemove(this.user?.uid),
      });
    }
  };

  ngOnInit() {
    this.authService.isChangeCurrentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
      if (this.user) this.isBlocked(this.user);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      if (this.user) this.isBlocked(this.user);
      console.log(this.user);
    }
  }

  isBlocked(user: User) {
    if (this.currentUser) {
      this.isBlockedByMe = this.currentUser.blockedUsers?.includes(user.uid)
        ? this.currentUser.blockedUsers?.includes(user.uid)
        : false;

      this.isBlockedByOther = user.blockedUsers?.includes(this.currentUser.uid)
        ? user.blockedUsers?.includes(this.currentUser.uid)
        : false;
    }
  }
}
