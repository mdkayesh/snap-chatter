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
        // loadChildren: () =>
        //   import('./components/inbox/inbox.component').then(
        //     (m) => m.InboxComponent
        //   ),
        component: InboxComponent,
      },
      {
        path: 'no-user',
        // loadChildren: () =>
        //   import('./pages/no-user/no-user.component').then(
        //     (m) => m.NoUserComponent
        //   ),
        component: NoUserComponent,
      },
    ],
  },
  {
    path: 'login',
    // loadChildren: () =>
    //   import('./pages/login/login.component').then((m) => m.LoginComponent),
    component: LoginComponent,
  },
  {
    path: 'signup',
    // loadChildren: () =>
    //   import('./pages/sign-up/sign-up.component').then(
    //     (m) => m.SignUpComponent
    //   ),
    component: SignUpComponent,
  },
];
