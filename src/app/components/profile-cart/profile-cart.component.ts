import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './profile-cart.component.html',
})
export class ProfileCartComponent implements OnChanges {
  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}
  @Input() user!: UserChat;
  isRead = false;
  self: boolean = false;
  chatId = '';
  fromNow = this.chatService.formatDate;

  handleSelectedLink = (link: string) => {
    this.chatService.setSelectedUserLink(link);
    localStorage.setItem('selectedUserLink', link);
    if (this.authService.currentUser)
      this.chatService.setChatId(
        this.user.uid,
        this.authService.currentUser?.uid
      );
    this.handleIsRead();
  };

  handleIsRead = () => {
    if (!this.user.lastMessage.read && !this.self) {
      if (this.chatService.selectedUserLink?.includes(this.user.uid)) {
        if (this.authService.currentUser) {
          updateDoc(doc(db, 'userChats', this.authService.currentUser.uid), {
            [this.user.lastMessage.chatId + '.lastMessage.read']: true,
          });
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    const currentUserId = this.authService.currentUser?.uid;
    const userId = this.user.uid;

    this.isRead =
      !this.user.lastMessage.read && this.user.lastMessage.senderId === userId;

    this.self = currentUserId === this.user.lastMessage.senderId;

    this.handleIsRead();
    if (!currentUserId) return;
    this.chatId =
      currentUserId > userId ? currentUserId + userId : userId + currentUserId;
  }
}
