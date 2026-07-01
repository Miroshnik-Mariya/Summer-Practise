import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderSmall } from '../header-small/header-small';
import { RouterLink, Router } from '@angular/router';
import { UserService, AuthResponse } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderSmall, RouterLink, HttpClientModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {
  user = {
    nickname: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    contactInfo: '',
    userInfo: '',
    achievement: '',
    image: ''
  };

  showPassword = false;
  isSubmitted = false;
  isLoading = false;
  errorMessage = '';

  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    console.log('Registration constructor called');
  }

  ngOnInit() {
    console.log('Registration ngOnInit called');
    console.log('UserService:', this.userService);
  }

  get isNicknameValid(): boolean {
    const len = this.user.nickname.length;
    return len >= 3 && len <= 20;
  }

  get isEmailValid(): boolean {
    return this.user.email.includes('@') && this.user.email.length <= 31;
  }

  get isPasswordValid(): boolean {
    const pass = this.user.password;
    const regex = /^[\w+]+$/;
    return pass.length >= 6 && pass.length <= 20 && regex.test(pass);
  }

  get isNameValid(): boolean {
    return this.user.name.length <= 31;
  }

  get isSurnameValid(): boolean {
    return this.user.surname.length <= 31;
  }

  get isContactInfoValid(): boolean {
    return this.user.contactInfo.length <= 255;
  }

  get isUserInfoValid(): boolean {
    return this.user.userInfo.length <= 255;
  }

  get isAchievementValid(): boolean {
    return this.user.achievement.length <= 255;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log('onSubmit() CALLED');
    
    this.isSubmitted = true;
    this.errorMessage = '';
    
    console.log('registerForm invalid:', this.registerForm?.invalid);
    
    if (this.registerForm?.invalid) {
      console.log('Form is invalid');
      const firstInvalid = document.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    console.log('Form is valid');
    console.log('User data:', this.user);
    
    this.isLoading = true;

    console.log('Sending to server...');
    this.userService.register({
      nickname: this.user.nickname,
      email: this.user.email,
      password: this.user.password,
      name: this.user.name || undefined,
      surname: this.user.surname || undefined,
      contactInfo: this.user.contactInfo || undefined,
      userInfo: this.user.userInfo || undefined,
      achievement: this.user.achievement || undefined,
      image: this.user.image || undefined
    }).subscribe({
      next: (response: AuthResponse) => {
        console.log('Registration SUCCESS:', response);
        this.isLoading = false;
        
        // Сохраняем данные пользователя
        if (response.user) {
          const authData = window.btoa(this.user.nickname + ':' + this.user.password);
          const userInfo = {
            nickname: response.user.nickname,
            photo: response.user.image || '',
            authData: authData
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem('isAuthenticated', 'true');
          
          // ✅ Уведомляем все компоненты об изменении статуса
          this.userService.authChanged.emit();
        }
        
        this.router.navigate(['']);
      },
      error: (error) => {
        console.log('Registration ERROR:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration error';
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm?.controls?.[fieldName];
    return this.isSubmitted && !!control && control.invalid;
  }

  getFieldError(fieldName: string): string {
    const control = this.registerForm?.controls?.[fieldName];
    if (!control || !control.errors) return '';

    const errors = control.errors;
    if (errors['required']) return 'Field is required';
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters`;
    if (errors['pattern']) return 'Invalid characters';
    if (errors['email']) return 'Enter valid email';
    return 'Invalid value';
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.registerForm?.controls?.[fieldName];
    return this.isSubmitted && !!control && control.invalid;
  }
}