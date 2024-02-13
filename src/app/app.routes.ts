import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { HomeComponent } from './pages/home/home.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { ChatsComponent } from './components/chats/chats.component';
import { NoUserComponent } from './pages/no-user/no-user.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ChatsComponent,
      },
      {
        path: 'user/:userId',
        component: InboxComponent,
      },
      {
        path: 'no-user',
        component: NoUserComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
];
