import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { doc, onSnapshot } from 'firebase/firestore';
import { Unsubscribe } from 'firebase/auth';
import { db } from '../../../firebase/firebase';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-inbox-message',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './inbox-message.component.html',
})
export class InboxMessageComponent
  implements OnChanges, AfterViewChecked, OnDestroy
{
  @Input() messageContainer!: HTMLDivElement;
  @Input() user!: User | null;
  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}
  currentUser = this.authService.currentUser;
  inboxUser: User | null = null;
  fromNow = this.chatService.formatDate;
  chatUsers: UserChat[] | null = null;
  messages: Message[] = [];
  unSub: Unsubscribe | undefined;
  prevMessagelength: number = 0;
  toggleModal: boolean = false;
  selectedImg: string = '';

  closeModal = () => {
    this.toggleModal = false;
  };

  handleSelectImg = (img: string) => {
    this.toggleModal = true;
    this.selectedImg = img;
  };

  fetchMessages = () => {
    if (this.user && this.currentUser) {
      this.messages = [];
      this.unSub = onSnapshot(
        doc(db, 'messages', this.chatService.chatId),
        (snapshot) => {
          if (!snapshot.exists()) this.messages = [];
          this.messages = [];
          const data = snapshot.data() as DeleteMessage;
          if (!this.currentUser) return;
          if (data?.deletedBy?.[this.currentUser.uid]) {
            this.messages = [];
          } else {
            this.messages = data?.['message'] || [];
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.inboxUser = this.chatService.inboxUser;
      this.fetchMessages();
    }

    this.chatUsers = this.chatService.chatsUsers;
  }

  isSeen(id: string): boolean {
    const lm = this.chatUsers?.find((user) => {
      user.lastMessage.id === id;
    });

    return lm?.lastMessage.read ? true : false;
  }

  ngAfterViewChecked(): void {
    if (this.messages.length !== this.prevMessagelength) {
      this.prevMessagelength = this.messages.length;

      this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    if (this.unSub) this.unSub();
  }
}
