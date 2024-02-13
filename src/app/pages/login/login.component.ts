import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [RouterLink],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  isEyeOpen = false;
  user = this.authService.currentUser;

  ngOnInit(): void {
    if (this.user) {
      this.router.navigate(['/']);
    }
  }

  onSignUpWithFb = async () => {
    await this.authService.signUpWithFacebook();
    if (this.authService.currentUser) {
      this.router.navigate(['/']);
    }
  };

  onSignUpWithGoogle = async () => {
    await this.authService.signUpWithGoogle();
    if (this.authService.currentUser) {
      this.router.navigate(['/']);
    }
  };
}
