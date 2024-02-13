import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OutSideClickDirective } from '../../directives/outside-click.directive';
import { fadeUp } from '../../animation/animation';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

@Component({
  selector: 'app-inbox-header',
  standalone: true,
  imports: [CommonModule, OutSideClickDirective],
  templateUrl: './inbox-header.component.html',
  animations: [fadeUp],
})
export class InboxHeaderComponent {
  @Input() user: User | null = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  isOpen: boolean = false;

  onOutSideClick = () => {
    this.isOpen = false;
  };

  handleDeleteConversation = async () => {
    this.isOpen = false;
    try {
      if (this.authService.currentUser && this.chatService.chatId) {
        const docRef = doc(db, 'messages', this.chatService.chatId);
        const chatRef = doc(db, 'userChats', this.authService.currentUser.uid);
        const docSnap = await getDoc(docRef);
        // const chatSnap = await getDoc(chatRef);
        const data = docSnap.data() as DeleteMessage;

        if (!docSnap.exists()) return;
        if (!data?.deletedBy) {
          await updateDoc(docRef, {
            deletedBy: {
              [this.authService.currentUser.uid]: true,
            },
          });
          const chats: { [key: string]: UserChat } = {};

          this.chatService.chatsUsers
            ?.filter(
              (chat) => this.chatService.chatId !== chat.lastMessage.chatId
            )
            .forEach((c) => (chats[c.lastMessage.chatId] = c));

          setDoc(chatRef, {
            ...chats,
          });

          this.chatService.chatsUsers = Object.values(chats);
        } else {
          await deleteDoc(docRef);
          // delete chatref
          const chats: { [key: string]: UserChat } = {};
          this.chatService.chatsUsers
            ?.filter(
              (chat) => this.chatService.chatId !== chat.lastMessage.chatId
            )
            .forEach((c) => (chats[c.lastMessage.chatId] = c));

          setDoc(chatRef, {
            ...chats,
          });
          console.log('all mesage deleted permanently');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  blockUser = async () => {
    try {
      if (this.authService.currentUser?.uid && this.user) {
        const docRef = doc(db, 'users', this.authService.currentUser?.uid);
        await updateDoc(docRef, {
          blockedUsers: arrayUnion(this.user.uid),
        });

        this.isOpen = false;
      }
    } catch (error) {
      console.log(error);
    }
  };
}
