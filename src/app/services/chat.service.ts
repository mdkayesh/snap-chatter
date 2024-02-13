import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable()
export class ChatService {
  selectedUserLink: string | null =
    localStorage.getItem('selectedUserLink') || null;
  inboxUser: User | null = null;
  chatId: string = '';
  chatsUsers: UserChat[] | null = null;

  // functions
  setChatId = (userId: string, currentUserId: string) => {
    this.chatId =
      currentUserId > userId ? currentUserId + userId : userId + currentUserId;
  };

  setInboxUser = (user: User | null) => {
    this.inboxUser = user;
  };

  setSelectedUserLink = (link: string | null) => {
    if (link) {
      this.selectedUserLink = link;
    }
  };

  setChatUsers = (users: UserChat[]) => {
    this.chatsUsers = users;
  };

  formatDate = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();

    if (diff < 60000) {
      return 'now';
    }

    if (diff < 3600000) {
      return `${Math.round(diff / 60000)} min ago`;
    }

    if (diff < 86400000) {
      return moment(date).format('h:mm A');
    }

    return moment(date).format('MM/DD/YY');
  };
}
