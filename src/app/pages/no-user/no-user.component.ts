import { Component, OnInit } from '@angular/core';
import { InboxFooterComponent } from '../../components/inbox-footer/inbox-footer.component';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-no-user',
  standalone: true,
  templateUrl: './no-user.component.html',
  imports: [InboxFooterComponent, RouterLink, CommonModule, SearchComponent],
})
export class NoUserComponent implements OnInit {
  constructor(private authService: AuthService) {}

  users: User[] | null = null;
  searchTerm: string = '';
  currentUser: User | null = this.authService.currentUser;
  arr = [...Array(3)];

  fetchUsers = () => {
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
  };

  ngOnInit(): void {
    this.fetchUsers();
  }

  handleSubmit = () => {
    this.users = null;
    const q = query(
      collection(db, 'users'),
      where('displayName', '==', this.searchTerm),
      limit(10)
    );

    getDocs(q)
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as User[];
        this.users = data;

        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
