import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatsComponent } from '../../components/chats/chats.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OutSideClickDirective } from '../../directives/outside-click.directive';
import { LeftSidebarComponent } from '../../components/left-sidebar/left-sidebar.component';
import { InboxComponent } from '../../components/inbox/inbox.component';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ChatsComponent,
    InboxComponent,
    LeftSidebarComponent,
    CommonModule,
    OutSideClickDirective,
    RouterModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private AuthService: AuthService,
    private chatService: ChatService
  ) {}
  user = this.AuthService.currentUser;
  isDesktop = window.innerWidth > 640;

  handleResize = () => {
    this.isDesktop = window.innerWidth > 640;
    if (this.isDesktop) {
      if (this.chatService.selectedUserLink) {
        this.router.navigate([this.chatService.selectedUserLink]);
      } else {
        this.router.navigate(['/no-user']);
      }
    } else {
      this.router.navigate(['/']);
    }
  };

  ngOnInit(): void {
    this.isDesktop = window.innerWidth > 640;
    if (this.isDesktop) {
      if (this.chatService.selectedUserLink) {
        this.router.navigate([this.chatService.selectedUserLink]);
      } else {
        this.router.navigate(['/no-user']);
      }
    } else {
      this.router.navigate(['/']);
    }

    window.addEventListener('resize', this.handleResize);

    if (this.AuthService.currentUser) return;
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }
}
