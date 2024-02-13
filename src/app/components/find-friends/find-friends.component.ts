import { Component } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { SearchComponent } from '../search/search.component';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-find-friends',
  standalone: true,
  imports: [ModalComponent, SearchComponent, CommonModule, RouterLink],
  templateUrl: './find-friends.component.html',
  styleUrl: './find-friends.component.css',
})
export class FindFriendsComponent {
  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}
  isOpenModal: boolean = false;
  users: User[] | null = null;
  searchTerm: string = '';
  currentUser: User | null = this.authService.currentUser;
  arr = [...Array(3)];

  handleSelectedLink = (link: string) => {
    this.chatService.setSelectedUserLink(link);
    localStorage.setItem('selectedUserLink', link);
    this.isOpenModal = false;
  };

  toggleModal = () => {
    this.isOpenModal = !this.isOpenModal;
    this.fetchUsers();
  };

  // fetch users data when isModalisOpen & chached it

  fetchUsers = () => {
    if (this.isOpenModal) {
      if (this.users) return;
      const colRef = collection(db, 'users');
      const q = query(colRef, orderBy('displayName'), limit(10));
      getDocs(q)
        .then((snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            uid: doc.id,
          })) as User[];
          this.users = data;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleSubmit = (searchTerm: string) => {
    console.log(searchTerm);
  };
}
