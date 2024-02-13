import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  isEyeOpen = false;
  isEyeOpen2 = false;
  isLoading = false;
  validationError = '';

  formData = {
    displayName: '',
    email: '',
    password: '',
    againPassword: '',
  };

  ngOnInit(): void {
    if (this.authService.currentUser) {
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

  onSubmit = async () => {
    const { displayName, againPassword, email, password } = this.formData;

    if (!displayName && !email && !password && !againPassword) {
      this.validationError = 'Please fill all fields';
      return;
    }

    if (password !== againPassword) {
      this.validationError = 'Passwords are not equal';
      return;
    }

    if (password.length < 6) {
      this.validationError = 'Password must be at least 6 characters long';
      return;
    }

    if (password.length > 20) {
      this.validationError = 'Password must be less than 20 characters long';
      return;
    }

    if (!email.includes('@')) {
      this.validationError = 'Email is not valid';
      return;
    }

    if (email.length > 50) {
      this.validationError = 'Email must be less than 50 characters long';
      return;
    }

    if (displayName.length > 50) {
      this.validationError =
        'Display name must be less than 50 characters long';
      return;
    }

    if (displayName.length < 3) {
      this.validationError = 'Display name must be at least 3 characters long';
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.createUserWithEmailPass(
        displayName,
        email,
        password
      );
      this.router.navigate(['/']);
      this.isLoading = false;
    } catch (error) {
      console.log(error);
      this.isLoading = false;
      this.validationError = 'Something went wrong! Please try again';
    }
  };
}
