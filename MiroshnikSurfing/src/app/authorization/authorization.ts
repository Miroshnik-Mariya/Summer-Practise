// authorization.ts
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeaderSmall } from '../header-small/header-small';
import { UserService, AuthResponse } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [HeaderSmall, FormsModule, CommonModule, RouterLink, HttpClientModule],
  templateUrl: './authorization.html',
  styleUrls: ['./authorization.css']
})
export class Authorization implements AfterViewInit {
  user = {
    login: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  isSubmitted = false;

  @ViewChild('loginInput') loginInput!: ElementRef;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.loginInput?.nativeElement?.focus();
    }, 100);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    setTimeout(() => {
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.focus();
      }
    }, 100);
  }

  onSubmit() {
    console.log('onSubmit() CALLED');
    
    this.isSubmitted = true;
    this.errorMessage = '';

    if (!this.user.login || !this.user.password) {
      this.errorMessage = 'Fill in all fields';
      return;
    }

    if (this.user.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;

    this.userService.login({
      login: this.user.login,
      password: this.user.password
    }).subscribe({
      next: (response: AuthResponse) => {
        console.log('Login successful');
        this.isLoading = false;
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log('Login error:', error);
        this.isLoading = false;
        
        if (error.status === 0) {
          this.errorMessage = 'Server unavailable. Check if backend is running (localhost:5001)';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Invalid login or password';
        }
      }
    });
  }

  onInputChange() {
    if (this.isSubmitted) {
      this.errorMessage = '';
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    if (!this.isSubmitted) return false;
    
    const control = this.user[fieldName as keyof typeof this.user];
    
    if (fieldName === 'login') {
      return !control || control.length === 0;
    }
    
    if (fieldName === 'password') {
      return !control || control.length < 6;
    }
    
    return false;
  }

  getFieldError(fieldName: string): string {
    if (!this.isSubmitted) return '';
    
    const control = this.user[fieldName as keyof typeof this.user];
    
    if (fieldName === 'login') {
      if (!control) return 'Field is required';
      return '';
    }
    
    if (fieldName === 'password') {
      if (!control) return 'Field is required';
      if (control.length < 6) return 'Minimum 6 characters';
      return '';
    }
    
    return '';
  }

  shouldShowError(fieldName: string): boolean {
    return this.isFieldInvalid(fieldName);
  }
}