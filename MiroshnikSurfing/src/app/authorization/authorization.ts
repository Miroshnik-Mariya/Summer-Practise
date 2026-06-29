import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HeaderSmall } from '../header-small/header-small';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [HeaderSmall, FormsModule, CommonModule, RouterLink],
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

  // База данных пользователей (для демонстрации)
  private users = [
    { login: 'user1', password: 'password123' },
    { login: 'user2', password: 'qwerty123' },
    { login: 'admin', password: 'admin123' },
    { login: 'test@mail.com', password: 'test123' },
    { login: 'Михаил', password: 'misha123' }
  ];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    // Автофокус на поле логина при загрузке
    setTimeout(() => {
      this.loginInput?.nativeElement?.focus();
    }, 100);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    // Фокус на поле пароля после переключения видимости
    setTimeout(() => {
      const passwordInput = document.getElementById('password') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.focus();
      }
    }, 100);
  }

  onSubmit() {
    this.isSubmitted = true;
    this.errorMessage = '';

    // Проверка на пустые поля
    if (!this.user.login || !this.user.password) {
      this.errorMessage = 'Заполнены не все поля!';
      return;
    }

    // Проверка формата логина (латиница, кириллица, цифры, подчеркивания, @ и . для email)
    const loginRegex = /^[a-zA-Zа-яА-ЯёЁ0-9_@.]+$/;
    if (!loginRegex.test(this.user.login)) {
      this.errorMessage = 'Логин содержит недопустимые символы';
      return;
    }

    // Проверка пароля (минимум 6 символов)
    if (this.user.password.length < 6) {
      this.errorMessage = 'Пароль должен содержать минимум 6 символов';
      return;
    }

    this.isLoading = true;

    // Имитация запроса к серверу
    setTimeout(() => {
      this.isLoading = false;
      
      // Проверка существования пользователя
      const user = this.users.find(u => u.login === this.user.login);
      
      if (!user) {
        this.errorMessage = 'Пользователя не существует!';
        return;
      }

      // Проверка пароля
      if (user.password !== this.user.password) {
        this.errorMessage = 'Введены неверные данные!';
        return;
      }

      // Успешный вход - переход на ленту новостей
      console.log('Вход выполнен:', this.user);
      this.router.navigate(['/feed']);
    }, 1500);
  }

  // Сброс ошибок при вводе
  onInputChange() {
    if (this.isSubmitted) {
      this.errorMessage = '';
    }
  }

  // Проверка поля на ошибку
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

  // Получение ошибки для поля
  getFieldError(fieldName: string): string {
    if (!this.isSubmitted) return '';
    
    const control = this.user[fieldName as keyof typeof this.user];
    
    if (fieldName === 'login') {
      if (!control) return 'Поле обязательно для заполнения';
      return '';
    }
    
    if (fieldName === 'password') {
      if (!control) return 'Поле обязательно для заполнения';
      if (control.length < 6) return 'Минимум 6 символов';
      return '';
    }
    
    return '';
  }

  shouldShowError(fieldName: string): boolean {
    return this.isFieldInvalid(fieldName);
  }
}