import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { CommonModule } from '@angular/common';
import { InboxHeaderComponent } from '../inbox-header/inbox-header.component';
import { InboxFooterComponent } from '../inbox-footer/inbox-footer.component';
import { InboxMessageComponent } from '../inbox-message/inbox-message.component';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-inbox',
  standalone: true,
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.css',
  imports: [
    CommonModule,
    InboxHeaderComponent,
    InboxFooterComponent,
    InboxMessageComponent,
  ],
})
export class InboxComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private chatService: ChatService
  ) {}
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  user: User | null = null;
  currentUser = this.authService.currentUser;
  prevMessagelength: number = 0;
  routerId = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['userId'];
      this.routerId = id;
      this.fetchDoc(id);
    });
  }

  fetchDoc = async (userId: string) => {
    this.user = null;
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      this.user = { ...docSnap.data(), uid: docSnap.id } as User;
      this.chatService.setInboxUser(this.user);

      if (this.currentUser)
        this.chatService.setChatId(this.user.uid, this.currentUser.uid);
    } catch (error) {
      console.log(error);
    }
  };
}
