import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { ProfileCartComponent } from '../profile-cart/profile-cart.component';
import { CommonModule } from '@angular/common';
import { Unsubscribe, doc, onSnapshot } from 'firebase/firestore';
import { AuthService } from '../../services/auth.service';
import { db } from '../../../firebase/firebase';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { scaleUp } from '../../animation/animation';

@Component({
  selector: 'app-chats',
  standalone: true,
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.css',
  imports: [SearchComponent, ProfileCartComponent, CommonModule],
  animations: [scaleUp],
})
export class ChatsComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}
  data: any | null = null;
  users: UserChat[] | null = null;
  isLoading: boolean = true;
  selectedChatLink: string = '';
  arr = [...Array(10)];
  unSub: Unsubscribe | undefined;
  searchTerm: string = '';
  filteredUsers: UserChat[] | [] = [];

  ngOnInit(): void {
    this.fetchUserChats();
  }

  onChange = (searchTerm: string) => {
    this.filteredUsers = this.users ? [...this.users] : [];
    this.filteredUsers = this.users!.filter((user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  sortingChats = (a: any, b: any): number => {
    const dateA = new Date(a.lastMessage.date);
    const dateB = new Date(b.lastMessage.date);

    // Compare dates
    if (dateB < dateA) return -1;
    if (dateB > dateA) return 1;
    return 0;
  };

  fetchUserChats = () => {
    this.isLoading = true;
    if (this.authService.currentUser) {
      this.unSub = onSnapshot(
        doc(db, 'userChats', this.authService.currentUser?.uid),
        (snapshot) => {
          if (snapshot.exists()) {
            this.data = snapshot.data();
            this.users = Object.values(this.data).sort(
              this.sortingChats
            ) as UserChat[];

            this.isLoading = false;
            this.filteredUsers = this.users;
            this.chatService.setChatUsers(this.users);
            if (localStorage.getItem('selectedUserLink')) return;

            localStorage.setItem(
              'selectedUserLink',
              '/user/' + this.users[0].uid
            );
            this.router.navigate([localStorage.getItem('selectedUserLink')]);
          }
          this.isLoading = false;
        },
        (error) => (this.isLoading = false)
      );
    }
  };

  ngOnDestroy(): void {
    if (this.unSub) this.unSub();
  }
}
